"""
Configuration for the Conversational Bot
Handles API keys and settings.
"""

import os
from pathlib import Path
from dotenv import load_dotenv

# Load environment variables from .env file
env_path = Path(__file__).parent / '.env'
if env_path.exists():
    load_dotenv(env_path)

# API Keys
# IMPORTANT: Replace 'your_gemini_api_key_here' with your actual Gemini API key
# Get it from: https://makersuite.google.com/app/apikey
GEMINI_API_KEY = os.getenv('GEMINI_API_KEY', 'AIzaSyD8JukG-b9dYHtu7U9ffdafAOlvKm24LgY')
ASSEMBLYAI_API_KEY = os.getenv('ASSEMBLYAI_API_KEY', '0a5659ce096b4d2b9f488f9f4ecff57b')
MURF_API_KEY = os.getenv('MURF_API_KEY', 'ap2_d09dfb5d-d2b5-45c0-9dcc-b95b8e27e16c')

# For quick testing without .env file, you can directly set the key here:
# GEMINI_API_KEY = "AIzaSy_your_actual_key_here"

# Conversation Settings
MAX_CONVERSATION_TURNS = 6  # 3-6 exchanges (both ways)
MIN_CONVERSATION_TURNS = 3

# Audio Settings
SAMPLE_RATE = 16000
CHANNELS = 1
FRAMES_PER_BUFFER = 800
