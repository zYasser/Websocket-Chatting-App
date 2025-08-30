import React, { useState, useEffect } from 'react';
import { MessageSquare, Users, ArrowRight } from 'lucide-react';

const LoginScreen = ({ onLogin }) => {
  const [username, setUsername] = useState('');
  const [room, setRoom] = useState('');
  const [availableRooms, setAvailableRooms] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    fetchAvailableRooms();
  }, []);

  const fetchAvailableRooms = async () => {
    try {
      const response = await fetch('http://localhost:8080/rooms');
      const rooms = await response.json();
      console.log(rooms);
      setAvailableRooms(rooms);
    } catch (error) {
      console.error('Failed to fetch rooms:', error);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (username.trim() && room.trim()) {
      setIsLoading(true);
      onLogin(username.trim(), room.trim());
    }
  };

  const handleRoomSelect = (selectedRoom) => {
    setRoom(selectedRoom);
    console.log(selectedRoom);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-primary-600 rounded-full mb-4">
            <MessageSquare className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Welcome to Chat</h1>
          <p className="text-gray-600">Join a room and start chatting with others</p>
        </div>

        <div className="card p-8">
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label htmlFor="username" className="block text-sm font-medium text-gray-700 mb-2">
                Username
              </label>
              <input
                type="text"
                id="username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className="input-field"
                placeholder="Enter your username"
                required
                autoFocus
              />
            </div>

            <div>
              <label htmlFor="room" className="block text-sm font-medium text-gray-700 mb-2">
                Room
              </label>
              <div className="flex gap-2">
                <input
                  type="text"
                  id="room"
                  value={room}
                  onChange={(e) => setRoom(e.target.value)}
                  className="input-field flex-1"
                  placeholder="Enter room name or select below"
                  required
                />
                <button
                  type="button"
                  onClick={() => setRoom('')}
                  className="btn-secondary px-3"
                  title="Clear room"
                >
                  ×
                </button>
              </div>
            </div>

            {availableRooms.length > 0 && (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Available Rooms
                </label>
                <div className="grid grid-cols-2 gap-2">
                  {availableRooms.map((roomName) => (
                    <button
                      key={roomName}
                      type="button"
                      onClick={() => handleRoomSelect(roomName)}
                      className={`p-2 text-sm rounded-lg border transition-colors ${
                        room === roomName
                          ? 'bg-primary-100 border-primary-300 text-primary-700'
                          : 'bg-gray-50 border-gray-200 text-gray-600 hover:bg-gray-100'
                      }`}
                    >
                      <Users className="w-4 h-4 inline mr-1" />
                      {roomName}
                    </button>
                  ))}
                </div>
              </div>
            )}

            <button
              type="submit"
              disabled={!username.trim() || !room.trim() || isLoading}
              className="btn-primary w-full flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isLoading ? (
                <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
              ) : (
                <>
                  Join Chat
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
          </form>
        </div>

        <div className="text-center mt-6">
          <p className="text-sm text-gray-500">
            Powered by WebSocket technology
          </p>
        </div>
      </div>
    </div>
  );
};

export default LoginScreen;
