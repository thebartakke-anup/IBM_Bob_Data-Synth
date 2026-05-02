# Data-Synth Development Server Startup Script
# This script starts both backend and frontend servers

Write-Host "🚀 Starting Data-Synth Development Servers..." -ForegroundColor Cyan
Write-Host ""

# Check if Node.js is installed
try {
    $nodeVersion = node --version
    Write-Host "✅ Node.js version: $nodeVersion" -ForegroundColor Green
} catch {
    Write-Host "❌ Node.js is not installed. Please install Node.js first." -ForegroundColor Red
    exit 1
}

# Start Backend Server
Write-Host ""
Write-Host "📦 Starting Backend Server..." -ForegroundColor Yellow
Start-Process powershell -ArgumentList "-NoExit", "-Command", "cd backend; npm run dev" -WindowStyle Normal

# Wait a bit for backend to start
Start-Sleep -Seconds 3

# Start Frontend Server
Write-Host "🎨 Starting Frontend Server..." -ForegroundColor Yellow
Start-Process powershell -ArgumentList "-NoExit", "-Command", "cd frontend; npm run dev" -WindowStyle Normal

# Wait for servers to start
Start-Sleep -Seconds 5

Write-Host ""
Write-Host "✅ Servers are starting up!" -ForegroundColor Green
Write-Host ""
Write-Host "📊 Backend:  http://localhost:3001" -ForegroundColor Cyan
Write-Host "🎨 Frontend: http://localhost:5173" -ForegroundColor Cyan
Write-Host ""
Write-Host "Press Ctrl+C in each terminal window to stop the servers" -ForegroundColor Yellow
Write-Host ""

# Test if servers are responding
Start-Sleep -Seconds 3

try {
    $backendHealth = Invoke-WebRequest -Uri "http://localhost:3001/api/health" -UseBasicParsing -TimeoutSec 5
    Write-Host "✅ Backend is responding!" -ForegroundColor Green
} catch {
    Write-Host "⚠️  Backend may still be starting up..." -ForegroundColor Yellow
}

try {
    $frontendHealth = Invoke-WebRequest -Uri "http://localhost:5173" -UseBasicParsing -TimeoutSec 5
    Write-Host "✅ Frontend is responding!" -ForegroundColor Green
} catch {
    Write-Host "⚠️  Frontend may still be starting up..." -ForegroundColor Yellow
}

Write-Host ""
Write-Host "🎉 Ready to use! Open http://localhost:5173 in your browser" -ForegroundColor Green
Write-Host ""

# Made with Bob
