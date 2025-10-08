@echo off
echo ========================================
echo   Preparing Files for Deployment
echo ========================================
echo.

echo Copying required Python modules...

copy ..\conversation_manager.py . >nul 2>&1
if %ERRORLEVEL% EQU 0 (
    echo [OK] conversation_manager.py
) else (
    echo [FAIL] conversation_manager.py
)

copy ..\llm_manager.py . >nul 2>&1
if %ERRORLEVEL% EQU 0 (
    echo [OK] llm_manager.py
) else (
    echo [FAIL] llm_manager.py
)

copy ..\report_generator.py . >nul 2>&1
if %ERRORLEVEL% EQU 0 (
    echo [OK] report_generator.py
) else (
    echo [FAIL] report_generator.py
)

echo.
echo ========================================
echo Checking required files...
echo ========================================

if exist app.py (echo [OK] app.py) else (echo [MISSING] app.py)
if exist Dockerfile (echo [OK] Dockerfile) else (echo [MISSING] Dockerfile)
if exist requirements.txt (echo [OK] requirements.txt) else (echo [MISSING] requirements.txt)
if exist conversation_manager.py (echo [OK] conversation_manager.py) else (echo [MISSING] conversation_manager.py)
if exist llm_manager.py (echo [OK] llm_manager.py) else (echo [MISSING] llm_manager.py)
if exist report_generator.py (echo [OK] report_generator.py) else (echo [MISSING] report_generator.py)

echo.
echo ========================================
echo Ready for deployment!
echo ========================================
echo.
echo Next steps:
echo 1. Set GEMINI_API_KEY: set GEMINI_API_KEY=your_key_here
echo 2. Run deploy.bat
echo.

pause
