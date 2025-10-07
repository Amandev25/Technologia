import os
import requests
from pathlib import Path
from murf import Murf

# Initialize Murf client
client = Murf(
    api_key="ap2_d09dfb5d-d2b5-45c0-9dcc-b95b8e27e16c",
)

try:
    # Generate speech
    audio_response = client.text_to_speech.generate(
        format="MP3",
        sample_rate=44100.0,
        text="Hello, world! This is a test of text-to-speech conversion.",
        voice_id="en-US-natalie",
    )
    
    # Get the current script directory
    script_dir = Path(__file__).parent
    
    # Create output filename with timestamp
    from datetime import datetime
    timestamp = datetime.now().strftime("%Y%m%d_%H%M%S")
    output_filename = f"generated_speech_{timestamp}.mp3"
    output_path = script_dir / output_filename
    
    # Check if audio_response.audio_file is a URL or binary data
    if isinstance(audio_response.audio_file, str):
        # If it's a URL, download the audio file
        print(f"Downloading audio from URL: {audio_response.audio_file}")
        response = requests.get(audio_response.audio_file)
        response.raise_for_status()  # Raise an exception for bad status codes
        
        # Save the downloaded audio file
        with open(output_path, 'wb') as audio_file:
            audio_file.write(response.content)
        
        print(f"Audio file downloaded and saved to: {output_path}")
        print(f"File size: {len(response.content)} bytes")
        
    else:
        # If it's binary data, save it directly
        with open(output_path, 'wb') as audio_file:
            audio_file.write(audio_response.audio_file)
        
        print(f"Audio file saved successfully to: {output_path}")
        print(f"File size: {len(audio_response.audio_file)} bytes")
    
except requests.RequestException as e:
    print(f"Error downloading audio file: {e}")
except Exception as e:
    print(f"Error generating or saving audio: {e}")
    print("Please check your API key and internet connection.")