import React, { useState, useRef, useEffect } from 'react';
import { useMessages } from '../context/MessageContext';
import { Send, Smile } from 'lucide-react';

const MessageInput = () => {
  const [message, setMessage] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const { sendMessage, isConnected } = useMessages();
  const textareaRef = useRef(null);

  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
      textareaRef.current.style.height = `${Math.min(textareaRef.current.scrollHeight, 120)}px`;
    }
  }, [message]);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (message.trim() && isConnected) {
      sendMessage(message.trim());
      setMessage('');
      setIsTyping(false);
      
      // Reset textarea height
      if (textareaRef.current) {
        textareaRef.current.style.height = 'auto';
      }
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSubmit(e);
    }
  };

  const handleInputChange = (e) => {
    setMessage(e.target.value);
    if (!isTyping && e.target.value.trim()) {
      setIsTyping(true);
    } else if (isTyping && !e.target.value.trim()) {
      setIsTyping(false);
    }
  };

  const isDisabled = !message.trim() || !isConnected;

  return (
    <div className="bg-white border-t border-gray-200 p-4">
      <form onSubmit={handleSubmit} className="flex items-end gap-3">
        <div className="flex-1 relative">
          <textarea
            ref={textareaRef}
            value={message}
            onChange={handleInputChange}
            onKeyDown={handleKeyDown}
            placeholder={isConnected ? "Type your message..." : "Connecting..."}
            disabled={!isConnected}
            className="w-full px-4 py-3 border border-gray-300 rounded-lg resize-none focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent disabled:bg-gray-100 disabled:cursor-not-allowed"
            rows={1}
            style={{ minHeight: '44px', maxHeight: '120px' }}
          />
          
          {/* Typing indicator */}
          {isTyping && (
            <div className="absolute bottom-2 right-3 text-xs text-gray-400">
              typing...
            </div>
          )}
        </div>
        
        <div className="flex items-center gap-2">
          <button
            type="button"
            className="p-3 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
            title="Emoji picker (coming soon)"
          >
            <Smile className="w-5 h-5" />
          </button>
          
          <button
            type="submit"
            disabled={isDisabled}
            className={`p-3 rounded-lg transition-all duration-200 ${
              isDisabled
                ? 'bg-gray-200 text-gray-400 cursor-not-allowed'
                : 'bg-primary-600 hover:bg-primary-700 text-white hover:scale-105'
            }`}
            title={isDisabled ? "Type a message to send" : "Send message"}
          >
            <Send className="w-5 h-5" />
          </button>
        </div>
      </form>
      
      {/* Connection status hint */}
      {!isConnected && (
        <div className="mt-2 text-center text-sm text-gray-500">
          <div className="inline-flex items-center gap-2">
            <div className="w-2 h-2 bg-red-500 rounded-full animate-pulse"></div>
            Connecting to chat server...
          </div>
        </div>
      )}
    </div>
  );
};

export default MessageInput;
