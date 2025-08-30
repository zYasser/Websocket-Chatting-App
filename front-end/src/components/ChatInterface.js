import React, { useState, useEffect, useRef } from 'react';
import { useMessages } from '../context/MessageContext';
import MessageList from './MessageList';
import MessageInput from './MessageInput';
import RoomSelector from './RoomSelector';
import ConnectionStatus from './ConnectionStatus';
import { LogOut, Settings, Users } from 'lucide-react';

const ChatInterface = ({ userInfo, onLogout }) => {
  const {
    isConnected,
    currentRoom,
    userCount,
    connectWebSocket,
    disconnect,
    fetchRooms
  } = useMessages();

  const [showRoomSelector, setShowRoomSelector] = useState(false);

  useEffect(() => {
    if (userInfo) {
      connectWebSocket(userInfo.username, userInfo.room);
      fetchRooms();
    }
  }, []);

  const handleRoomChange = (newRoom) => {
    if (newRoom !== currentRoom) {
      connectWebSocket(userInfo.username, newRoom);
      setShowRoomSelector(false);
    }
  };

  const handleLogout = () => {
    disconnect();
    onLogout();
  };

  return (
    <div className="flex flex-col h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 px-6 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 bg-green-500 rounded-full"></div>
              <h1 className="text-xl font-semibold text-gray-900">Chat Room</h1>
            </div>
            <div className="flex items-center gap-2 text-sm text-gray-600">
              <Users className="w-4 h-4" />
              <span>{userCount} online</span>
            </div>
          </div>
          
          <div className="flex items-center gap-3">
            <button
              onClick={() => setShowRoomSelector(!showRoomSelector)}
              className="btn-secondary flex items-center gap-2"
            >
              <Settings className="w-4 h-4" />
              Change Room
            </button>
            <button
              onClick={handleLogout}
              className="btn-secondary flex items-center gap-2 text-red-600 hover:text-red-700 hover:bg-red-50"
            >
              <LogOut className="w-4 h-4" />
              Logout
            </button>
          </div>
        </div>
        
        {/* Current Room Info */}
        <div className="mt-3 flex items-center gap-2">
          <span className="text-sm text-gray-500">Room:</span>
          <span className="px-3 py-1 bg-primary-100 text-primary-700 rounded-full text-sm font-medium">
            {currentRoom}
          </span>
          <span className="text-sm text-gray-500">•</span>
          <span className="text-sm text-gray-500">Logged in as:</span>
          <span className="px-3 py-1 bg-gray-100 text-gray-700 rounded-full text-sm font-medium">
            {userInfo?.username}
          </span>
        </div>
      </div>

      {/* Connection Status */}
      <ConnectionStatus isConnected={isConnected} />

      {/* Room Selector */}
      {showRoomSelector && (
        <RoomSelector
          currentRoom={currentRoom}
          onRoomChange={handleRoomChange}
          onClose={() => setShowRoomSelector(false)}
        />
      )}

      {/* Chat Area */}
      <div className="flex-1 flex flex-col min-h-0">
        <MessageList />
        <MessageInput />
      </div>
    </div>
  );
};

export default ChatInterface;
