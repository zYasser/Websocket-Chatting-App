package main

import (
	"encoding/json"
	"fmt"
	"log"
	"net/http"
	"websocket-chat/chat"
)

func main() {
	hubManager := chat.NewHubManager()
	http.HandleFunc("/ws", func(w http.ResponseWriter, r *http.Request) {
		chat.HandleWebsocket(hubManager, w, r)
	})
	http.HandleFunc("/", func(w http.ResponseWriter, r *http.Request) {
		w.Header().Set("Access-Control-Allow-Origin", "*")
		http.ServeFile(w, r, "index.html")
	})
	http.HandleFunc("/rooms", func(w http.ResponseWriter, r *http.Request) {
		w.Header().Set("Access-Control-Allow-Origin", "*")
		fmt.Println("Fetching rooms")
		rooms := hubManager.GetRooms()
		fmt.Println("Rooms:", rooms)
		json.NewEncoder(w).Encode(rooms)
	})

	log.Println("Server is running on port 8080")
	log.Fatal(http.ListenAndServe(":8080", nil))
}
