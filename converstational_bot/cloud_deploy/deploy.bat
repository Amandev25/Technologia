@echo off
REM Deployment script for Google Cloud Run (Windows)

echo ========================================
echo   Conversational Bot - Cloud Run Deploy
echo ========================================
echo.

REM Check if gcloud is installed
where gcloud >nul 2>nul
if %ERRORLEVEL% NEQ 0 (
    echo Error: gcloud CLI is not installed
    echo Install it from: https://cloud.google.com/sdk/docs/install
    pause
    exit /b 1
)

REM Get project ID
for /f "tokens=*" %%i in ('gcloud config get-value project 2^>nul') do set PROJECT_ID=%%i
if "%PROJECT_ID%"=="" (
    echo Error: No GCP project set
    echo Set it with: gcloud config set project YOUR_PROJECT_ID
    pause
    exit /b 1
)

echo Project: %PROJECT_ID%

REM Check Gemini API Key
if "%GEMINI_API_KEY%"=="" (
    echo Error: GEMINI_API_KEY environment variable not set
    echo Set it with: set GEMINI_API_KEY=your_api_key_here
    pause
    exit /b 1
)

echo Gemini API Key configured
echo.

REM Configuration
set SERVICE_NAME=conversational-bot-api
set REGION=us-central1

echo Configuration:
echo   Service Name: %SERVICE_NAME%
echo   Region: %REGION%
echo.

REM Confirm deployment
set /p CONFIRM="Deploy to Cloud Run? (y/n): "
if /i not "%CONFIRM%"=="y" (
    echo Deployment cancelled
    pause
    exit /b 0
)

REM Enable required APIs
echo.
echo Enabling required APIs...
gcloud services enable cloudbuild.googleapis.com run.googleapis.com containerregistry.googleapis.com --project=%PROJECT_ID%

echo.
echo Building and deploying with Cloud Build...
gcloud builds submit --config=cloudbuild.yaml --substitutions=_GEMINI_API_KEY="%GEMINI_API_KEY%" --project=%PROJECT_ID%

echo.
echo ========================================
echo Deployment Successful!
echo ========================================
echo.

REM Get service URL
for /f "tokens=*" %%i in ('gcloud run services describe %SERVICE_NAME% --region=%REGION% --format="value(status.url)" --project=%PROJECT_ID%') do set SERVICE_URL=%%i

echo Service URL: %SERVICE_URL%
echo.
echo API Endpoints:
echo   Health Check: %SERVICE_URL%/api/health
echo   Start Conversation: %SERVICE_URL%/api/start_conversation
echo   Generate Response: %SERVICE_URL%/api/generate_response
echo   Generate Report: %SERVICE_URL%/api/generate_report
echo.
echo Test the API:
echo   curl %SERVICE_URL%/api/health
echo.
echo Update frontend API_URL in web_ui/app.js:
echo   const API_URL = '%SERVICE_URL%/api';
echo.

pause
