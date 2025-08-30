import React, { createContext, useContext, useEffect, useState, useCallback } from 'react';

const MessageContext = createContext();

export const useMessages = () => {
  const context = useContext(MessageContext);
  if (!context) {
    throw new Error('useMessages must be used within a MessageProvider');
  }
  return context;
};

export const MessageProvider = ({ children }) => {
  const [messages, setMessages] = useState([]);
  const [socket, setSocket] = useState(null);
  const [isConnected, setIsConnected] = useState(false);
  const [rooms, setRooms] = useState([]);
  const [currentRoom, setCurrentRoom] = useState('');
  const [userCount, setUserCount] = useState(0);

  // Fetch available rooms
  const fetchRooms = useCallback(async () => {
    try {
      const response = await fetch('/rooms');
      const roomsData = await response.json();
      setRooms(roomsData);
    } catch (error) {
      console.error('Failed to fetch rooms:', error);
    }
  }, []);

  // Connect to WebSocket
  const connectWebSocket = useCallback((username, room) => {
    if (socket) {
      socket.close();
    }

    const wsUrl = `ws://localhost:8080/ws?username=${encodeURIComponent(username)}&room=${encodeURIComponent(room)}`;
    const newSocket = new WebSocket(wsUrl);

    newSocket.onopen = () => {
      setIsConnected(true);
      setCurrentRoom(room);
      console.log('WebSocket connected');
    };

    newSocket.onmessage = async (event) => {
      try {
        const message = JSON.parse(event.data);
        console.log('Received message:', message);
        
        setMessages(prev => [...prev, message]);
        
        // Update user count if available
        if (message.userCount !== undefined) {
          setUserCount(message.userCount);
        }
      } catch (error) {
        console.error('Failed to parse message:', error);
      }
    };

    newSocket.onclose = () => {
      setIsConnected(false);
      console.log('WebSocket disconnected');
    };

    newSocket.onerror = (error) => {
      console.error('WebSocket error:', error);
      setIsConnected(false);
    };

    setSocket(newSocket);
  }, [socket]);

  // Send message
  const sendMessage = useCallback((content) => {
    if (socket && socket.readyState === WebSocket.OPEN) {
      const message = {
        type: 'message',
        content,
        timestamp: new Date().toISOString()
      };
      socket.send(JSON.stringify(message));
    }
  }, [socket]);

  // Change room
  const changeRoom = useCallback((username, newRoom) => {
    setMessages([]);
    setUserCount(0);
    connectWebSocket(username, newRoom);
  }, [connectWebSocket]);

  // Disconnect WebSocket
  const disconnect = useCallback(() => {
    if (socket) {
      socket.close();
      setSocket(null);
      setIsConnected(false);
      setMessages([]);
      setUserCount(0);
    }
  }, [socket]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (socket) {
        socket.close();
      }
    };
  }, [socket]);

  const value = {
    messages,
    isConnected,
    rooms,
    currentRoom,
    userCount,
    sendMessage,
    connectWebSocket,
    changeRoom,
    disconnect,
    fetchRooms
  };

  return (
    <MessageContext.Provider value={value}>
      {children}
    </MessageContext.Provider>
  );
};
