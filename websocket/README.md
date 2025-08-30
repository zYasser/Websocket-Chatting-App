# 🚀 Go WebSocket Chat Application

A high-performance, real-time chat application built with **Go** and **Gorilla WebSocket** that allows multiple users to join and chat together with minimal latency and maximum efficiency.

## ✨ Features

- **Real-time messaging** using native WebSocket protocol
- **User join/leave notifications** with automatic broadcasting
- **Modern, responsive UI** with smooth animations
- **High-performance** Go backend with goroutines
- **Automatic reconnection** handling
- **Connection status indicators**
- **Scalable architecture** ready for production use
- **Modular code structure** for better maintainability

## 🛠️ Technologies Used

- **Backend**: Go 1.21+
- **WebSocket**: Gorilla WebSocket
- **HTTP Router**: Gorilla Mux
- **Frontend**: HTML5, CSS3, Vanilla JavaScript
- **Architecture**: Hub-based WebSocket management

## 📋 Prerequisites

- **Go 1.21 or higher** installed on your system
- Basic knowledge of Go programming
- A modern web browser

## 🚀 Quick Start

### 1. **Install Dependencies**
```bash
make deps
# or manually:
go mod tidy
```

### 2. **Run the Application**
```bash
make run
# or manually:
go run main.go
```

### 3. **Access the Chat**
Open your browser and navigate to: `http://localhost:8080`

## 🏗️ Project Structure

```
websocket-chat/
├── 📁 models/           # Data models and structures
│   └── chat.go         # ChatMessage struct and constants
├── 📁 hub/             # WebSocket hub management
│   ├── hub.go          # Hub struct and core logic
│   └── client.go       # Client connection handling
├── 📁 handlers/        # HTTP and WebSocket handlers
│   ├── http.go         # HTTP page serving
│   └── websocket.go    # WebSocket connection handling
├── 📁 router/          # HTTP routing configuration
│   └── router.go       # Router setup and configuration
├── 📁 config/          # Application configuration
│   └── config.go       # Environment and settings
├── 📁 utils/           # Utility functions
│   └── utils.go        # Common helper functions
├── 📁 static/          # Frontend assets
│   └── index.html      # Chat interface
├── 📄 main.go          # Application entry point
├── 📄 go.mod           # Go module dependencies
├── 📄 Makefile         # Build and development commands
└── 📄 README.md        # This documentation
```

## 🔧 How It Works

### **Backend Architecture**

#### **1. Models Package (`models/chat.go`)**
```go
type ChatMessage struct {
    Sender    string    `json:"sender"`
    Content   string    `json:"content"`
    Timestamp time.Time `json:"timestamp"`
    Type      string    `json:"type"`
}
```

#### **2. Hub Package (`hub/hub.go` & `hub/client.go`)**
```go
type Hub struct {
    clients    map[*Client]bool
    Broadcast  chan []byte
    Register   chan *Client
    Unregister chan *Client
    mutex      sync.RWMutex
}
```

The Hub acts as a central message broker that:
- Manages all WebSocket connections
- Broadcasts messages to all connected clients
- Handles client registration/unregistration
- Ensures thread-safe operations

#### **3. Handlers Package (`handlers/`)**
- **`websocket.go`**: WebSocket connection management
- **`http.go`**: HTTP page serving and static files

#### **4. Router Package (`router/router.go`)**
- Configures HTTP routes
- Maps endpoints to handlers
- Serves static files

### **Message Flow**

```
User A types message → 
WebSocket sends to server → 
Hub receives and broadcasts → 
All connected clients receive message → 
Messages appear in real-time
```

### **Frontend Implementation**

#### **WebSocket Connection**
```javascript
const wsUrl = `ws://${window.location.host}/ws?username=${encodeURIComponent(username)}`;
ws = new WebSocket(wsUrl);
```

#### **Message Handling**
```javascript
ws.onmessage = function(event) {
    const message = JSON.parse(event.data);
    showMessage(message);
};
```

## 🔌 API Endpoints

| Endpoint | Method | Description |
|----------|--------|-------------|
| `/` | GET | Serves the chat interface |
| `/ws` | WebSocket | WebSocket connection endpoint |

## 📱 Usage Guide

### **1. Join the Chat**
- Enter your username in the input field
- Click "Join Chat" button
- Wait for connection confirmation

### **2. Send Messages**
- Type your message in the input field
- Press Enter or click Send button
- Messages appear instantly for all users

### **3. Real-time Features**
- See when users join/leave
- View connection status
- Automatic reconnection on disconnection

## 🧪 Testing the Application

### **Multi-User Testing**
1. Open multiple browser tabs/windows
2. Join with different usernames
3. Send messages to see real-time communication
4. Close tabs to see leave notifications

### **Connection Testing**
1. Join the chat
2. Close the browser tab
3. Reopen and rejoin
4. Verify automatic reconnection

## ⚡ Performance Features

- **Goroutines**: Concurrent message handling
- **Channels**: Efficient message passing
- **Mutex**: Thread-safe client management
- **Connection pooling**: Optimized WebSocket handling
- **Memory efficient**: Minimal memory footprint

## 🔒 Security Considerations

- **Origin checking**: WebSocket origin validation
- **Input sanitization**: Message content validation
- **Connection limits**: Configurable connection limits
- **Rate limiting**: Built-in message rate limiting

## 🚀 Production Deployment

### **Environment Variables**
```bash
export PORT=8080
export HOST=0.0.0.0
```

### **Build for Production**
```bash
make build
./bin/chat-app
```

### **Docker Support**
```dockerfile
FROM golang:1.21-alpine
WORKDIR /app
COPY . .
RUN go mod download
RUN go build -o main .
EXPOSE 8080
CMD ["./main"]
```

## 🛠️ Development Commands

The project includes a comprehensive Makefile for common tasks:

```bash
make deps          # Install dependencies
make build         # Build the application
make run           # Run the application
make test          # Run tests
make fmt           # Format code
make lint          # Lint code
make clean         # Clean build artifacts
make dev           # Development mode with hot reload
make help          # Show all available commands
```

## 🔧 Customization

### **Adding New Message Types**
```go
// In models/chat.go
const (
    MessageTypeChat    = "CHAT"
    MessageTypeJoin    = "JOIN"
    MessageTypeLeave   = "LEAVE"
    MessageTypeTyping  = "TYPING"  // New type
)
```

### **Implementing Private Messaging**
```go
// Add to hub/hub.go
func (h *Hub) SendPrivateMessage(username string, message []byte) {
    // Implementation for private messaging
}
```

### **Adding Database Persistence**
```go
// Create models/storage.go
type MessageStore interface {
    SaveMessage(msg models.ChatMessage) error
    GetRecentMessages(limit int) ([]models.ChatMessage, error)
}
```

## 🐛 Troubleshooting

### **Common Issues**

1. **Port already in use**
   ```bash
   # Use Makefile
   make clean
   make run
   ```

2. **WebSocket connection failed**
   - Check if server is running
   - Verify browser supports WebSocket
   - Check firewall settings

3. **Messages not appearing**
   - Check browser console for errors
   - Verify WebSocket connection status
   - Check server logs

## 📊 Monitoring & Logging

### **Enable Debug Logging**
```go
log.SetFlags(log.LstdFlags | log.Lshortfile)
```

### **Connection Metrics**
```go
// Use hub methods
clientCount := hub.GetClientCount()
clients := hub.GetClients()
```

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## 📄 License

This project is open source and available under the [MIT License](LICENSE).

## 🙏 Acknowledgments

- **Gorilla WebSocket** team for the excellent WebSocket library
- **Go community** for the robust ecosystem
- **WebSocket specification** for the real-time communication standard

---

**Happy Chatting! 🎉**

For questions or support, please open an issue in the repository.
