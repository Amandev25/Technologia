"""
Launcher script for the Streamlit UI
Provides an easy way to start the web interface.
"""

import subprocess
import sys
import os
from pathlib import Path

def main():
    """Launch the Streamlit UI."""
    # Get the directory of this script
    script_dir = Path(__file__).parent
    
    # Path to the Streamlit app
    app_path = script_dir / "streamlit_app.py"
    
    if not app_path.exists():
        print(f"Error: Streamlit app not found at {app_path}")
        return 1
    
    print("🚀 Starting Conversational Bot Web Interface...")
    print("📱 The app will open in your default web browser")
    print("🌐 If it doesn't open automatically, go to: http://localhost:8501")
    print("🛑 Press Ctrl+C to stop the server")
    print("-" * 60)
    
    try:
        # Run Streamlit
        subprocess.run([
            sys.executable, "-m", "streamlit", "run", 
            str(app_path),
            "--server.port", "8501",
            "--server.address", "localhost",
            "--browser.gatherUsageStats", "false"
        ])
    except KeyboardInterrupt:
        print("\n🛑 Server stopped by user")
        return 0
    except Exception as e:
        print(f"❌ Error starting server: {e}")
        return 1

if __name__ == "__main__":
    exit_code = main()
    sys.exit(exit_code)
