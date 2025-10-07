#!/usr/bin/env python3
"""
Startup script for the Essay Corrector Streamlit App
"""

import os
import sys
import subprocess
from datetime import datetime

def check_dependencies():
    """Check if required dependencies are installed"""
    try:
        import streamlit
        import requests
        print("✅ All dependencies are installed")
        return True
    except ImportError as e:
        print(f"❌ Missing dependency: {e}")
        print("Please install requirements: pip install -r requirements.txt")
        return False

def check_api_server():
    """Check if the API server is running"""
    try:
        import requests
        response = requests.get("http://localhost:8000/health", timeout=5)
        if response.status_code == 200:
            print("✅ API server is running")
            return True
        else:
            print("❌ API server is not responding properly")
            return False
    except:
        print("⚠️  API server is not running")
        print("   Start the API server first: python start_server.py")
        return False

def main():
    """Main startup function"""
    print("🚀 Starting Essay Corrector Streamlit App")
    print("=" * 50)
    print(f"📅 Date: {datetime.now().strftime('%Y-%m-%d %H:%M:%S')}")
    print(f"📁 Working Directory: {os.getcwd()}")
    print("=" * 50)
    
    # Check dependencies
    if not check_dependencies():
        sys.exit(1)
    
    # Check API server (optional warning)
    check_api_server()
    
    print("\n🌐 Starting Streamlit app...")
    print("📱 The app will open in your default browser")
    print("🔗 URL: http://localhost:8501")
    print("\n💡 Tips:")
    print("   - Make sure the API server is running for full functionality")
    print("   - Use Ctrl+C to stop the app")
    print("=" * 50)
    
    try:
        # Start Streamlit app
        subprocess.run([
            sys.executable, "-m", "streamlit", "run", "streamlit_app.py",
            "--server.port", "8501",
            "--server.address", "localhost",
            "--browser.gatherUsageStats", "false"
        ])
    except KeyboardInterrupt:
        print("\n🛑 Streamlit app stopped by user")
    except Exception as e:
        print(f"❌ Error starting Streamlit app: {e}")
        sys.exit(1)

if __name__ == "__main__":
    main()
