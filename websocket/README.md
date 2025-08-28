# WebSocket Chat Application

A real-time chat application built with Spring Boot and WebSocket technology that allows multiple users to join and chat together.

## Features

- Real-time messaging using WebSocket
- User join/leave notifications
- Clean and responsive UI
- Support for multiple concurrent users
- Automatic message broadcasting

## Technologies Used

- **Backend**: Spring Boot 3.5.5
- **WebSocket**: Spring WebSocket with STOMP
- **Frontend**: HTML, CSS, JavaScript
- **Libraries**: SockJS, STOMP.js

## How to Run

1. **Prerequisites**: Make sure you have Java 17+ and Maven installed

2. **Run the application**:
   ```bash
   mvn spring-boot:run
   ```

3. **Access the application**: Open your browser and go to `http://localhost:8080`

## How to Use

1. **Join Chat**: Enter a username and click "Join Chat"
2. **Send Messages**: Type your message and press Enter or click Send
3. **Real-time Updates**: See messages from other users in real-time
4. **User Notifications**: Get notified when users join or leave the chat

## Architecture

- **WebSocketConfig**: Configures WebSocket endpoints and message broker
- **ChatController**: Handles WebSocket message routing
- **ChatMessage**: Data model for chat messages
- **Frontend**: HTML client with JavaScript for WebSocket communication

## WebSocket Endpoints

- `/ws` - WebSocket connection endpoint
- `/app/chat.sendMessage` - Send chat messages
- `/app/chat.addUser` - Add user to chat
- `/topic/public` - Public chat topic for broadcasting messages

## Testing

1. Open multiple browser tabs/windows
2. Join with different usernames
3. Send messages to see real-time communication
4. Close tabs to see leave notifications

## Customization

You can customize the application by:
- Modifying the UI styles in `index.html`
- Adding new message types in `ChatMessage.java`
- Implementing private messaging
- Adding user authentication
- Storing chat history in a database


