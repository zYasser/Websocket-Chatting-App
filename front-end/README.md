# 🚀 WebSocket Chat Frontend

A modern, responsive React frontend for the WebSocket chat application built with Tailwind CSS and modern React patterns.

## ✨ Features

- **Real-time messaging** with WebSocket connection
- **Room-based chat system** with ability to create and join rooms
- **Modern UI/UX** with Tailwind CSS and smooth animations
- **Responsive design** that works on all devices
- **Connection status indicators** with real-time feedback
- **User authentication** with persistent login
- **Message types support** (text, system, join/leave notifications)
- **Auto-scroll** to latest messages
- **Typing indicators** and message timestamps

## 🛠️ Technologies Used

- **Frontend Framework**: React 18.2.0
- **Styling**: Tailwind CSS 3.3.0
- **Icons**: Lucide React
- **Date Handling**: date-fns
- **State Management**: React Context API
- **Build Tool**: Create React App

## 📋 Prerequisites

- **Node.js 16+** and npm
- **Go backend** running on port 8080 (see websocket/README.md)

## 🚀 Quick Start

### 1. **Install Dependencies**
```bash
cd front-end
npm install
```

### 2. **Start the Backend**
Make sure your Go WebSocket backend is running:
```bash
cd ../websocket
go run main.go
```

### 3. **Start the Frontend**
In a new terminal:
```bash
cd front-end
npm start
```

The app will open at `http://localhost:3000`

## 🏗️ Project Structure

```
front-end/
├── 📁 public/              # Static assets
│   └── index.html         # Main HTML file
├── 📁 src/                # Source code
│   ├── 📁 components/     # React components
│   │   ├── ChatInterface.js    # Main chat interface
│   │   ├── ConnectionStatus.js # Connection status bar
│   │   ├── LoginScreen.js      # Login/room selection
│   │   ├── MessageInput.js     # Message input form
│   │   ├── MessageItem.js      # Individual message display
│   │   ├── MessageList.js      # Message list container
│   │   └── RoomSelector.js     # Room selection modal
│   ├── 📁 context/        # React Context
│   │   └── MessageContext.js   # WebSocket and message state
│   ├── App.js             # Main app component
│   ├── index.js           # App entry point
│   └── index.css          # Tailwind CSS imports
├── package.json           # Dependencies and scripts
├── tailwind.config.js     # Tailwind configuration
└── postcss.config.js      # PostCSS configuration
```

## 🔧 How It Works

### **Component Architecture**

#### **1. App.js**
- Manages authentication state
- Handles login/logout flow
- Wraps the app with MessageProvider

#### **2. MessageContext.js**
- Manages WebSocket connection
- Handles message state and room management
- Provides connection status and user count

#### **3. ChatInterface.js**
- Main chat layout and header
- Manages room changes and logout
- Integrates all chat components

#### **4. Message Components**
- **MessageList**: Displays all messages with auto-scroll
- **MessageItem**: Renders individual messages with proper styling
- **MessageInput**: Handles message input and submission

### **WebSocket Integration**

The frontend connects to the Go backend using the WebSocket protocol:

```javascript
// Connection URL format
ws://localhost:8080/ws?username={username}&room={room}

// Message format
{
  type: "message",
  content: "Hello world!",
  timestamp: "2024-01-01T12:00:00Z"
}
```

### **State Management**

Uses React Context API for global state:
- WebSocket connection status
- Current room and user information
- Message history
- Available rooms list

## 🎨 UI/UX Features

### **Design System**
- **Color Palette**: Blue primary colors with gray accents
- **Typography**: Clean, readable fonts with proper hierarchy
- **Spacing**: Consistent spacing using Tailwind's spacing scale
- **Animations**: Smooth transitions and micro-interactions

### **Responsive Design**
- Mobile-first approach
- Adaptive layouts for different screen sizes
- Touch-friendly interface elements

### **Accessibility**
- Proper ARIA labels
- Keyboard navigation support
- High contrast color schemes
- Screen reader friendly

## 🔌 API Endpoints

The frontend communicates with these backend endpoints:

- **`/ws`** - WebSocket connection for real-time chat
- **`/rooms`** - GET available chat rooms
- **`/`** - Serves the main HTML page

## 🚀 Development

### **Available Scripts**

```bash
npm start          # Start development server
npm run build      # Build for production
npm test           # Run tests
npm run eject      # Eject from Create React App
```

### **Environment Variables**

The app uses a proxy configuration in `package.json` to forward API requests to the Go backend:

```json
{
  "proxy": "http://localhost:8080"
}
```

### **Customization**

#### **Styling**
- Modify `tailwind.config.js` for theme customization
- Update `src/index.css` for global styles
- Component-specific styles use Tailwind utility classes

#### **Features**
- Add new message types in `MessageItem.js`
- Extend room functionality in `RoomSelector.js`
- Enhance WebSocket handling in `MessageContext.js`

## 🐛 Troubleshooting

### **Common Issues**

1. **WebSocket Connection Failed**
   - Ensure Go backend is running on port 8080
   - Check browser console for connection errors
   - Verify proxy configuration in package.json

2. **Messages Not Sending**
   - Check WebSocket connection status
   - Verify message format matches backend expectations
   - Check browser console for errors

3. **Styling Issues**
   - Ensure Tailwind CSS is properly imported
   - Check PostCSS configuration
   - Verify build process completed successfully

### **Debug Mode**

Enable detailed logging by checking the browser console for:
- WebSocket connection events
- Message send/receive logs
- Room change notifications

## 📱 Browser Support

- **Chrome**: 90+
- **Firefox**: 88+
- **Safari**: 14+
- **Edge**: 90+

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 🔗 Related

- [Go WebSocket Backend](../websocket/README.md) - Backend implementation
- [Project Overview](../../README.md) - Complete project documentation
