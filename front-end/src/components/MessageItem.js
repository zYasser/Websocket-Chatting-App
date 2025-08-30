import React from 'react';
import { formatDistanceToNow } from 'date-fns';

const MessageItem = ({ message, isOwnMessage }) => {
  const formatTime = (timestamp) => {
    try {
      const date = new Date(timestamp);
      return formatDistanceToNow(date, { addSuffix: true });
    } catch {
      return 'just now';
    }
  };

  const getMessageTypeStyles = () => {
    switch (message.type) {
      case 'system':
        return 'bg-yellow-100 text-yellow-800 border-yellow-200 mx-auto text-center max-w-md';
      case 'join':
      case 'leave':
        return 'bg-blue-100 text-blue-800 border-blue-200 mx-auto text-center max-w-md';
      default:
        return isOwnMessage
          ? 'bg-primary-600 text-white ml-auto'
          : 'bg-white text-gray-900 border border-gray-200';
    }
  };

  const getMessageIcon = () => {
    switch (message.type) {
      case 'system':
        return (
          <div className="w-6 h-6 bg-yellow-500 rounded-full flex items-center justify-center">
            <svg className="w-3 h-3 text-white" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
            </svg>
          </div>
        );
      case 'join':
        return (
          <div className="w-6 h-6 bg-green-500 rounded-full flex items-center justify-center">
            <svg className="w-3 h-3 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
            </svg>
          </div>
        );
      case 'leave':
        return (
          <div className="w-6 h-6 bg-red-500 rounded-full flex items-center justify-center">
            <svg className="w-3 h-3 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 12H4" />
            </svg>
          </div>
        );
      default:
        return null;
    }
  };

  const getMessageContent = () => {
    switch (message.type) {
      case 'system':
        return message.content;
      case 'join':
        return `${message.username} joined the room`;
      case 'leave':
        return `${message.username} left the room`;
      default:
        return message.content;
    }
  };

  if (message.type === 'system' || message.type === 'join' || message.type === 'leave') {
    return (
      <div className={`px-4 py-2 rounded-lg border ${getMessageTypeStyles()} animate-fade-in`}>
        <div className="flex items-center justify-center gap-2">
          {getMessageIcon()}
          <span className="text-sm font-medium">{getMessageContent()}</span>
        </div>
        <div className="text-xs text-center mt-1 opacity-75">
          {formatTime(message.timestamp)}
        </div>
      </div>
    );
  }

  return (
    <div className={`flex ${isOwnMessage ? 'justify-end' : 'justify-start'} animate-slide-up`}>
      <div className={`max-w-xs lg:max-w-md px-4 py-2 rounded-lg ${getMessageTypeStyles()}`}>
        {!isOwnMessage && (
          <div className="text-xs font-medium text-gray-600 mb-1">
            {message.username}
          </div>
        )}
        <div className="text-sm break-words">{message.content}</div>
        <div className={`text-xs mt-1 ${isOwnMessage ? 'text-primary-100' : 'text-gray-500'}`}>
          {formatTime(message.timestamp)}
        </div>
      </div>
    </div>
  );
};

export default MessageItem;
