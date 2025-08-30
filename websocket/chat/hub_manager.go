package chat

type HubManager struct {
	hubs map[string]*Hub
}

func (h *HubManager) createHub(hubName string) *Hub {
	hub := NewHub()
	go hub.Run()
	h.hubs[hubName] = hub
	return hub
}

func (h *HubManager) isHubExists(hubName string) bool {
	_, ok := h.hubs[hubName]
	return ok
}

func (h *HubManager) getHub(hubName string) *Hub {
	return h.hubs[hubName]
}
func (h *HubManager) GetRooms() []string {
	rooms := make([]string, 0, len(h.hubs))
	for room := range h.hubs {
		rooms = append(rooms, room)
	}
	return rooms
}


func NewHubManager() *HubManager {
	return &HubManager{
		hubs: make(map[string]*Hub),
	}
}
