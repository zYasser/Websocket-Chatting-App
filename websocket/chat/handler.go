package chat

import (
	"encoding/json"
	"fmt"
	"log"
	"math"
	"net/http"
	"sync"
	"time"
	"websocket-chat/models"

	"github.com/gorilla/websocket"
)

const (
	// Time allowed to write a message to the peer.
	writeWait = 10 * time.Second
	// Time allowed to read the next pong message from the peer.
	pongWait = 60 * time.Second
	// Send pings to peer with this period. Must be less than pongWait.
	pingPeriod = (pongWait * 9) / 10
	// Maximum message size allowed from peer.
	maxMessageSize = 512
	// Maximum number of ping retries before considering connection dead
	maxPingRetries = 3
	// Base delay for exponential backoff
	baseRetryDelay = 500 * time.Millisecond
	// Maximum retry delay
	maxRetryDelay = 5 * time.Second
)

var upgrader = websocket.Upgrader{
	ReadBufferSize:  1024,
	WriteBufferSize: 1024,
	CheckOrigin: func(r *http.Request) bool {
		return true
	},
}

func HandleWebsocket(hubManager *HubManager, w http.ResponseWriter, r *http.Request) {
	conn, err := upgrader.Upgrade(w, r, nil)
	if err != nil {
		log.Printf("upgrade error: %v", err)
		return
	}

	username := r.URL.Query().Get("username")
	if username == "" {
		username = "Anonymous"
	}

	room := r.URL.Query().Get("room")
	if room == "" {
		room = "default"
	}
	fmt.Println("Room:", room)

	hub := hubManager.getHub(room)
	if hub == nil {
		hub = hubManager.createHub(room)
	}
	rooms := hubManager.GetRooms()
	fmt.Println(" new Rooms:", rooms)

	client := newClient(hub, username, conn)
	go client.ReadPump()
	go client.WritePump()
	hub.registerClient(client)
}

type Client struct {
	Id           string
	hub          *Hub
	Conn         *websocket.Conn
	send         chan []byte
	mu           sync.RWMutex
	pingRetries  int
	lastPongTime time.Time
	isConnected  bool
}

func newClient(hub *Hub, id string, conn *websocket.Conn) *Client {
	return &Client{
		Id:           id,
		hub:          hub,
		Conn:         conn,
		send:         make(chan []byte, 256),
		pingRetries:  0,
		lastPongTime: time.Now(),
		isConnected:  true,
	}
}

func (c *Client) ReadPump() {
	defer func() {
		c.setConnected(false)
		c.Conn.Close()
		c.hub.unregisterClient(c)
	}()

	c.Conn.SetReadLimit(maxMessageSize)
	c.Conn.SetReadDeadline(time.Now().Add(pongWait))
	c.Conn.SetPongHandler(func(string) error {
		c.mu.Lock()
		c.lastPongTime = time.Now()
		c.pingRetries = 0 // Reset retries on successful pong
		c.mu.Unlock()

		c.Conn.SetReadDeadline(time.Now().Add(pongWait))
		log.Printf("Client %s: Received pong, resetting ping retries", c.Id)
		return nil
	})

	for {
		var msg models.Message
		err := c.Conn.ReadJSON(&msg)
		if err != nil {
			if websocket.IsUnexpectedCloseError(err, websocket.CloseGoingAway, websocket.CloseAbnormalClosure) {
				log.Printf("Client %s: Unexpected close error: %v", c.Id, err)
			}
			break
		}

		json, err := json.Marshal(msg)
		if err != nil {
			log.Printf("Client %s: JSON marshal error: %v", c.Id, err)
			continue
		}

		c.hub.broadcast <- json
	}
}

func (c *Client) WritePump() {
	ticker := time.NewTicker(pingPeriod)
	defer func() {
		ticker.Stop()
		c.setConnected(false)
		c.Conn.Close()
		c.hub.unregisterClient(c)
	}()

	for {
		select {
		case message, ok := <-c.send:
			if !c.isConnected {
				return
			}

			c.Conn.SetWriteDeadline(time.Now().Add(writeWait))
			if !ok {
				c.Conn.WriteMessage(websocket.CloseMessage, []byte{})
				return
			}

			// Send the raw message bytes as a text message
			if err := c.Conn.WriteMessage(websocket.TextMessage, message); err != nil {
				log.Printf("Client %s: Write error: %v", c.Id, err)
				return
			}

		case <-ticker.C:
			if !c.isConnected {
				return
			}

			// Check if we need to retry ping
			if c.shouldRetryPing() {
				if c.handlePingRetry() {
					continue
				}
				// Max retries exceeded, close connection
				log.Printf("Client %s: Max ping retries exceeded, closing connection", c.Id)
				return
			}

			// Send regular ping
			if err := c.sendPing(); err != nil {
				log.Printf("Client %s: Ping error: %v", c.Id, err)
				return
			}
		}
	}
}

func (c *Client) shouldRetryPing() bool {
	c.mu.RLock()
	defer c.mu.RUnlock()

	timeSinceLastPong := time.Since(c.lastPongTime)
	return timeSinceLastPong > pongWait && c.pingRetries < maxPingRetries
}

func (c *Client) handlePingRetry() bool {
	c.mu.Lock()
	c.pingRetries++
	retries := c.pingRetries
	c.mu.Unlock()

	if retries > maxPingRetries {
		return false
	}

	// Calculate exponential backoff delay
	delay := c.calculateRetryDelay(retries)
	log.Printf("Client %s: Ping retry %d/%d, waiting %v", c.Id, retries, maxPingRetries, delay)

	// Wait before retry
	time.Sleep(delay)

	// Send ping with retry
	if err := c.sendPing(); err != nil {
		log.Printf("Client %s: Ping retry %d failed: %v", c.Id, retries, err)
		return retries < maxPingRetries
	}

	log.Printf("Client %s: Ping retry %d sent successfully", c.Id, retries)
	return true
}

func (c *Client) sendPing() error {
	c.Conn.SetWriteDeadline(time.Now().Add(writeWait))
	err := c.Conn.WriteMessage(websocket.PingMessage, nil)
	if err == nil {
		log.Printf("Client %s: Ping sent", c.Id)
	}
	return err
}

func (c *Client) calculateRetryDelay(retryCount int) time.Duration {
	// Exponential backoff: baseDelay * 2^(retryCount-1)
	delay := time.Duration(float64(baseRetryDelay) * math.Pow(2, float64(retryCount-1)))
	if delay > maxRetryDelay {
		delay = maxRetryDelay
	}
	return delay
}

func (c *Client) setConnected(connected bool) {
	c.mu.Lock()
	defer c.mu.Unlock()
	c.isConnected = connected
}

func (c *Client) IsConnected() bool {
	c.mu.RLock()
	defer c.mu.RUnlock()
	return c.isConnected
}

// GetConnectionStats returns current connection statistics
func (c *Client) GetConnectionStats() map[string]interface{} {
	c.mu.RLock()
	defer c.mu.RUnlock()

	return map[string]interface{}{
		"id":              c.Id,
		"connected":       c.isConnected,
		"ping_retries":    c.pingRetries,
		"last_pong_time":  c.lastPongTime,
		"time_since_pong": time.Since(c.lastPongTime),
	}
}
