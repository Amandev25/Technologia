"""
Configuration for Cloud Run Deployment
Loads settings from environment variables for production.
"""

import os
from pathlib import Path

# Load environment variables
# In Cloud Run, these are set via environment variables in the service configuration

# API Keys
GEMINI_API_KEY = os.getenv('GEMINI_API_KEY')

# Conversation Settings
MAX_CONVERSATION_TURNS = int(os.getenv('MAX_CONVERSATION_TURNS', '6'))
MIN_CONVERSATION_TURNS = int(os.getenv('MIN_CONVERSATION_TURNS', '3'))

# Audio Settings (not used in Cloud API, but kept for compatibility)
SAMPLE_RATE = 16000
CHANNELS = 1
FRAMES_PER_BUFFER = 800
