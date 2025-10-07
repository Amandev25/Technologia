"""
Configuration settings for the Essay Corrector API
"""

import os
from typing import List

# Google AI Configuration
GOOGLE_API_KEY = os.getenv("GOOGLE_API_KEY")

# Server Configuration
HOST = os.getenv("HOST", "0.0.0.0")
PORT = int(os.getenv("PORT", "8000"))
DEBUG = os.getenv("DEBUG", "False").lower() == "true"

# CORS Configuration
ALLOWED_ORIGINS = os.getenv("ALLOWED_ORIGINS", "*").split(",")

# Essay Validation Configuration
MIN_ESSAY_LENGTH = 10
MAX_ESSAY_LENGTH = 10000

# LLM Configuration
DEFAULT_MODEL = "gemini-2.0-flash"
MAX_OUTPUT_TOKENS = 4096
TEMPERATURE = 0.0
TOP_P = 1.0
TOP_K = 1

# Logging Configuration
LOG_LEVEL = os.getenv("LOG_LEVEL", "INFO")

def validate_config():
    """Validate that required configuration is present"""
    if not GOOGLE_API_KEY:
        raise ValueError("GOOGLE_API_KEY environment variable is required")
    
    return True
