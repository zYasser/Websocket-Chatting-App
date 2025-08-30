import React, { useState, useEffect } from 'react';
import ChatInterface from './components/ChatInterface';
import LoginScreen from './components/LoginScreen';
import { MessageProvider } from './context/MessageContext';

function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userInfo, setUserInfo] = useState(null);

  useEffect(() => {
    // Check if user info exists in localStorage
    const savedUser = localStorage.getItem('chatUser');
    if (savedUser) {
      setUserInfo(JSON.parse(savedUser));
      setIsLoggedIn(true);
    }
  }, []);

  const handleLogin = (username, room) => {
    const user = { username, room };
    setUserInfo(user);
    setIsLoggedIn(true);
    localStorage.setItem('chatUser', JSON.stringify(user));
  };

  const handleLogout = () => {
    setUserInfo(null);
    setIsLoggedIn(false);
    localStorage.removeItem('chatUser');
  };

  if (!isLoggedIn) {
    return (

      <LoginScreen onLogin={handleLogin} />
    )
  }

  return (
    <MessageProvider>
      <div className="min-h-screen bg-gray-50">
        <ChatInterface 
          userInfo={userInfo} 
          onLogout={handleLogout}
        />
      </div>
    </MessageProvider>
  );
}

export default App;
