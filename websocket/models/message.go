package models

import "time"

// Message represents a chat message
type Message struct {
	Type      string    `json:"type"`
	Username  string    `json:"username"`
	Content   string    `json:"content"`
	Timestamp time.Time `json:"timestamp"`
	UserCount int       `json:"userCount,omitempty"`
}

type Rooms struct {
	Rooms []string `json:"rooms"`
}

