@echo off
echo ======================================
echo Essay Corrector - Web UI Server
echo ======================================
echo.
echo Starting web server on http://localhost:3000
echo Press Ctrl+C to stop the server
echo.

python -m http.server 3000 --directory .

