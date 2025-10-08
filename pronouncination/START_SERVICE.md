# How to Start the Pronunciation Service

## Step 1: Install Python Dependencies

Open Command Prompt in the `pronouncination` folder and run:

```bash
cd pronouncination
pip install -r requirement.txt
```

## Step 2: Start the FastAPI Server

Run this command:

```bash
uvicorn api:app --reload --host 0.0.0.0 --port 8000
```

**Explanation:**
- `uvicorn` - ASGI server for FastAPI
- `api:app` - Runs the `app` from `api.py` file
- `--reload` - Auto-restart on code changes
- `--host 0.0.0.0` - Makes it accessible from other devices
- `--port 8000` - Runs on port 8000

## Step 3: Verify It's Running

You should see:
```
INFO:     Uvicorn running on http://0.0.0.0:8000 (Press CTRL+C to quit)
INFO:     Started reloader process
INFO:     Started server process
INFO:     Waiting for application startup.
INFO:     Application startup complete.
```

## Step 4: Test the API

Open your browser and visit:
- http://localhost:8000 - Welcome message
- http://localhost:8000/docs - Interactive API documentation
- http://localhost:8000/breakdown?word=hello - Test pronunciation

## Available Endpoints

1. **GET /** - Welcome message
2. **GET /breakdown?word=hello** - Get pronunciation breakdown for a word
3. **GET /random-words** - Get random words in English, Hindi, Telugu

## Troubleshooting

### Error: "uvicorn: command not found"
Install uvicorn:
```bash
pip install uvicorn
```

### Error: Module not found
Install all dependencies:
```bash
pip install -r requirement.txt
```

### Error: Port already in use
Use a different port:
```bash
uvicorn api:app --reload --host 0.0.0.0 --port 8001
```

## For Mobile App Integration

Once running, the backend will connect to:
- `http://localhost:8000` (from backend server)
- `http://10.0.0.237:8000` (from mobile app)

Make sure both services are running:
1. Backend (Node.js) on port 3000
2. Pronunciation (Python) on port 8000
