@echo off
echo ========================================
echo Starting Schools24 Backend Server
echo ========================================

REM Navigate to backend directory
cd /d "C:\Users\paree\OneDrive\Desktop\Schools24\backend"

REM Check if Node.js is installed
node --version >nul 2>&1
if %errorlevel% neq 0 (
    echo ERROR: Node.js is not installed!
    echo Please install Node.js from https://nodejs.org/
    pause
    exit /b 1
)

REM Check if package.json exists
if not exist "package.json" (
    echo ERROR: Backend directory not found or package.json missing!
    echo Current directory: %CD%
    pause
    exit /b 1
)

REM Install dependencies if node_modules doesn't exist
if not exist "node_modules" (
    echo Installing dependencies...
    npm install
    if %errorlevel% neq 0 (
        echo ERROR: Failed to install dependencies!
        pause
        exit /b 1
    )
)

REM Run database seeding if requested
if "%1"=="seed" (
    echo Seeding database...
    npm run seed
    echo.
)

REM Start the server
echo Starting server on http://localhost:5000
echo Press Ctrl+C to stop the server
echo.
npm run dev