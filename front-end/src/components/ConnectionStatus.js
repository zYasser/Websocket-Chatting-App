import React from 'react';
import { Wifi, WifiOff } from 'lucide-react';

const ConnectionStatus = ({ isConnected }) => {
  if (isConnected) {
    return (
      <div className="bg-green-50 border-b border-green-200 px-6 py-2">
        <div className="flex items-center gap-2 text-green-700 text-sm">
          <Wifi className="w-4 h-4" />
          <span>Connected to chat server</span>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-red-50 border-b border-red-200 px-6 py-2">
      <div className="flex items-center gap-2 text-red-700 text-sm">
        <WifiOff className="w-4 h-4" />
        <span>Disconnected from chat server</span>
      </div>
    </div>
  );
};

export default ConnectionStatus;
