@echo off
echo ========================================
echo Starting AI Learning App Services
echo ========================================
echo.

echo Starting Backend (Node.js)...
start "Backend Server" cmd /k "cd backend && node index.js"
timeout /t 3

echo Starting Pronunciation Service (Python)...
start "Pronunciation Service" cmd /k "cd pronouncination && uvicorn api:app --reload --host 0.0.0.0 --port 8000"
timeout /t 3

echo Starting Mobile App (Expo)...
start "Mobile App" cmd /k "cd mobile-app && npm start"

echo.
echo ========================================
echo All services started!
echo ========================================
echo.
echo Backend: http://localhost:3000
echo Pronunciation: http://localhost:8000
echo Mobile App: Check the Expo terminal
echo.
echo Press any key to exit this window...
pause > nul
