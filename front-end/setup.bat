@echo off
echo 🚀 Setting up WebSocket Chat Frontend...

REM Check if Node.js is installed
node --version >nul 2>&1
if %errorlevel% neq 0 (
    echo ❌ Node.js is not installed. Please install Node.js 16+ first.
    echo    Download from: https://nodejs.org/
    pause
    exit /b 1
)

REM Check Node.js version
for /f "tokens=1,2 delims=." %%a in ('node --version') do set NODE_VERSION=%%a
set NODE_VERSION=%NODE_VERSION:~1%
if %NODE_VERSION% lss 16 (
    echo ❌ Node.js version 16+ is required. Current version: 
    node --version
    echo    Please upgrade Node.js from: https://nodejs.org/
    pause
    exit /b 1
)

echo ✅ Node.js detected:
node --version

REM Check if npm is installed
npm --version >nul 2>&1
if %errorlevel% neq 0 (
    echo ❌ npm is not installed. Please install npm first.
    pause
    exit /b 1
)

echo ✅ npm detected:
npm --version

REM Install dependencies
echo 📦 Installing dependencies...
npm install

if %errorlevel% equ 0 (
    echo ✅ Dependencies installed successfully!
    echo.
    echo 🎉 Setup complete! To start the frontend:
    echo    npm start
    echo.
    echo 📝 Make sure your Go backend is running on port 8080 first!
    echo    cd ../websocket ^&^& go run main.go
) else (
    echo ❌ Failed to install dependencies. Please check the error above.
)

pause
