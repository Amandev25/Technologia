@echo off
echo ========================================
echo  Conversational Bot - Web UI Server
echo ========================================
echo.
echo Starting Flask backend server...
echo Backend will be available at: http://localhost:5000
echo.
echo After backend starts, open index.html in your browser
echo or visit: http://localhost:8000
echo.
echo Press Ctrl+C to stop the server
echo ========================================
echo.

python backend_api.py

pause
