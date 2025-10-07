#!/usr/bin/env python3
"""
Startup script for the Essay Corrector API
"""

import os
import sys
import logging
from datetime import datetime

def setup_environment():
    """Setup environment variables and logging"""
    
    # Check if GOOGLE_API_KEY is set
    if not os.getenv("GOOGLE_API_KEY"):
        print("❌ ERROR: GOOGLE_API_KEY environment variable is not set!")
        print("Please set your Google AI API key:")
        print("export GOOGLE_API_KEY='your_api_key_here'")
        sys.exit(1)
    
    print("✅ GOOGLE_API_KEY is set")
    
    # Create logs directory
    os.makedirs("logs", exist_ok=True)
    print("✅ Logs directory created")
    
    # Print startup information
    print("\n" + "="*50)
    print("🚀 Starting Essay Corrector API")
    print("="*50)
    print(f"📅 Date: {datetime.now().strftime('%Y-%m-%d %H:%M:%S')}")
    print(f"📁 Working Directory: {os.getcwd()}")
    print(f"📝 Log File: logs/essay_corrector_{datetime.now().strftime('%Y%m%d')}.log")
    print("🌐 Server will be available at: http://localhost:8000")
    print("📚 API Documentation: http://localhost:8000/docs")
    print("="*50 + "\n")

if __name__ == "__main__":
    setup_environment()
    
    # Import and run the main application
    try:
        import uvicorn
        from main import app
        
        uvicorn.run(
            app, 
            host="0.0.0.0", 
            port=8000,
            log_level="info",
            access_log=True
        )
    except KeyboardInterrupt:
        print("\n🛑 Server stopped by user")
    except Exception as e:
        print(f"❌ Error starting server: {e}")
        sys.exit(1)
