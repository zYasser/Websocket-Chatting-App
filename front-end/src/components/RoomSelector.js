import React, { useState, useEffect } from 'react';
import { useMessages } from '../context/MessageContext';
import { X, Plus, Hash } from 'lucide-react';

const RoomSelector = ({ currentRoom, onRoomChange, onClose }) => {
  const { rooms, fetchRooms } = useMessages();
  const [newRoomName, setNewRoomName] = useState('');
  const [isCreating, setIsCreating] = useState(false);

  useEffect(() => {
    fetchRooms();
  }, [fetchRooms]);

  const handleCreateRoom = () => {
    if (newRoomName.trim() && newRoomName.trim() !== currentRoom) {
      setIsCreating(true);
      onRoomChange(newRoomName.trim());
      setNewRoomName('');
      setIsCreating(false);
    }
  };

  const handleRoomSelect = (roomName) => {
    if (roomName !== currentRoom) {
      onRoomChange(roomName);
    }
  };

  return (
    <div className="bg-white border-b border-gray-200 p-4">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-medium text-gray-900">Change Room</h3>
        <button
          onClick={onClose}
          className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
        >
          <X className="w-5 h-5" />
        </button>
      </div>

      {/* Create new room */}
      <div className="mb-6">
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Create New Room
        </label>
        <div className="flex gap-2">
          <input
            type="text"
            value={newRoomName}
            onChange={(e) => setNewRoomName(e.target.value)}
            placeholder="Enter room name"
            className="input-field flex-1"
            onKeyDown={(e) => e.key === 'Enter' && handleCreateRoom()}
          />
          <button
            onClick={handleCreateRoom}
            disabled={!newRoomName.trim() || isCreating}
            className="btn-primary flex items-center gap-2 disabled:opacity-50"
          >
            <Plus className="w-4 h-4" />
            Create
          </button>
        </div>
      </div>

      {/* Available rooms */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Available Rooms
        </label>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
          {rooms.map((roomName) => (
            <button
              key={roomName}
              onClick={() => handleRoomSelect(roomName)}
              className={`p-3 text-left rounded-lg border transition-all ${
                roomName === currentRoom
                  ? 'bg-primary-50 border-primary-300 text-primary-700 ring-2 ring-primary-200'
                  : 'bg-gray-50 border-gray-200 text-gray-700 hover:bg-gray-100 hover:border-gray-300'
              }`}
            >
              <div className="flex items-center gap-2">
                <Hash className="w-4 h-4" />
                <span className="font-medium">{roomName}</span>
                {roomName === currentRoom && (
                  <span className="ml-auto text-xs bg-primary-100 text-primary-700 px-2 py-1 rounded-full">
                    Current
                  </span>
                )}
              </div>
            </button>
          ))}
        </div>
        
        {rooms.length === 0 && (
          <div className="text-center text-gray-500 py-8">
            <div className="w-12 h-12 mx-auto mb-3 bg-gray-100 rounded-full flex items-center justify-center">
              <Hash className="w-6 h-6 text-gray-400" />
            </div>
            <p className="text-sm">No rooms available</p>
            <p className="text-xs">Create a new room to get started</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default RoomSelector;
