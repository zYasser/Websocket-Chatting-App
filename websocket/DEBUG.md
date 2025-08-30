# WebSocket Chat Application - Debug Guide

## Overview
This is a WebSocket-based chat application written in Go with a web-based frontend. The application has been refactored into separate modules for better organization and includes comprehensive logging for debugging.

## File Structure
```
websocket/
├── main.go              # Main application entry point
├── index.html           # Main chat interface
├── test_client.html     # Simple test client for debugging
├── models/
│   ├── message.go       # Message data structure
│   └── client.go        # Client connection handling
├── hub/
│   └── hub.go          # Message broadcasting and client management
├── handlers/
│   ├── http.go         # HTTP request handling
│   └── websocket.go    # WebSocket connection handling
└── bin/
    └── chat-app        # Compiled binary
```

## Running the Application

### Build and Run
```bash
# Build the application
go build -o bin/chat-app .

# Run the application
./bin/chat-app
```

Or run directly:
```bash
go run .
```

The server will start on port 8080.

## Accessing the Application

- **Main Chat Interface**: http://localhost:8080/
- **Test Client**: http://localhost:8080/test
- **WebSocket Endpoint**: ws://localhost:8080/ws

## Debugging Message Sending Issues

### 1. Check Server Logs
The Go backend now includes comprehensive logging with prefixes:
- `[Main]` - Main application events
- `[Hub]` - Hub operations (client registration, message broadcasting)
- `[Client]` - Individual client operations
- `[WebSocket]` - WebSocket connection handling
- `[HTTP]` - HTTP request handling

### 2. Check Browser Console
Open the browser's Developer Tools (F12) and check the Console tab for:
- WebSocket connection status
- Message sending attempts
- Any JavaScript errors

### 3. Use the Debug Panel
The main chat interface now includes a debug panel that shows:
- Connection attempts
- Message sending status
- WebSocket state changes
- Error messages

### 4. Use the Test Client
The test client at `/test` provides:
- Simple connection testing
- Message sending verification
- Detailed connection logs
- Clear status indicators

## Common Issues and Solutions

### Issue: Can't Send Messages

#### Check WebSocket State
In the browser console, check:
```javascript
// Check if WebSocket exists
console.log(ws);

// Check WebSocket state
console.log(ws.readyState);
// 0 = CONNECTING
// 1 = OPEN
// 2 = CLOSING
// 3 = CLOSED
```

#### Verify Connection
1. Check if the WebSocket connection is established
2. Look for connection errors in server logs
3. Verify the WebSocket URL is correct

#### Check Message Format
Messages must be valid JSON with this structure:
```json
{
  "type": "message",
  "content": "Your message here",
  "timestamp": "2024-01-01T12:00:00Z"
}
```

### Issue: Messages Not Broadcasting

#### Check Hub Logs
Look for these log entries:
- `[Hub] Broadcasting message to all clients`
- `[Hub] Message sent to client X successfully`

#### Check Client Count
Verify that clients are properly registered:
- `[Hub] Client X registered successfully. Total clients: N`

### Issue: Connection Drops

#### Check Ping/Pong
The application uses ping/pong for connection health:
- `[Client X] Ping sent successfully`
- Look for ping errors in logs

#### Check Read/Write Deadlines
- Read deadline: 60 seconds
- Write deadline: 10 seconds
- Ping interval: 54 seconds

## Testing the Application

### 1. Single User Test
1. Open http://localhost:8080/ in one browser tab
2. Send a message
3. Check server logs for message processing
4. Verify message appears in chat

### 2. Multi-User Test
1. Open multiple browser tabs/windows
2. Connect with different usernames
3. Send messages between users
4. Verify broadcasting works

### 3. Connection Test
1. Use the test client at http://localhost:8080/test
2. Connect and send test messages
3. Check connection logs
4. Verify message delivery

## Performance Monitoring

### Client Count
Monitor the number of connected clients in server logs:
- `[Hub] Total clients: N`

### Message Throughput
Check message processing in logs:
- `[Hub] Broadcasting message to N clients`
- `[Client X] Message written successfully`

### Connection Health
Monitor ping/pong success rates:
- `[Client X] Ping sent successfully`
- Look for ping failures

## Troubleshooting Steps

1. **Start the server** and check for startup logs
2. **Open the test client** and attempt connection
3. **Check server logs** for connection events
4. **Send a test message** and monitor the flow
5. **Check browser console** for client-side errors
6. **Verify WebSocket state** in browser console
7. **Check message format** being sent

## Log Analysis

### Successful Message Flow
```
[Main] Starting WebSocket chat server...
[Main] Hub created successfully
[Main] Hub started in background
[Main] HTTP routes configured
[Main] Server listening on :8080
[HTTP] Home page request from 127.0.0.1: GET /
[HTTP] Serving index.html to 127.0.0.1
[WebSocket] New connection attempt from 127.0.0.1
[WebSocket] Connection upgraded successfully for user: TestUser
[WebSocket] Client created for user: TestUser
[WebSocket] Client TestUser sent to hub for registration
[Hub] Client TestUser registering
[Hub] Client TestUser registered successfully. Total clients: 1
[Hub] Broadcasting welcome message: {...}
[Client TestUser] Starting ReadPump
[Client TestUser] Starting WritePump
```

### Message Broadcasting Flow
```
[Client TestUser] Received message: {...}
[Client TestUser] Broadcasting message: {...}
[Hub] Broadcasting message to all clients: {...}
[Hub] Broadcasting to 1 clients
[Hub] Message sent to client TestUser successfully
[Client TestUser] Writing message to client: {...}
[Client TestUser] Message written successfully
```

## Support

If you continue to experience issues:
1. Check all logs for error patterns
2. Verify WebSocket connection state
3. Test with the simple test client
4. Check browser compatibility
5. Verify no firewall/proxy interference



