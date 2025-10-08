"""
Audio Processing Module
Handles Speech-to-Text and Text-to-Speech integration for the conversational bot.
"""

import pyaudio
import websocket
import json
import threading
import time
import wave
import requests
import os
import re
from urllib.parse import urlencode
from datetime import datetime
from pathlib import Path
from typing import Optional, Callable, List
from murf import Murf

class AudioProcessor:
    def __init__(self):
        # STT Configuration (AssemblyAI)
        self.stt_api_key = "0a5659ce096b4d2b9f488f9f4ecff57b"
        self.stt_connection_params = {
            "sample_rate": 16000,
            "format_turns": True
        }
        self.stt_api_endpoint = f"wss://streaming.assemblyai.com/v3/ws?{urlencode(self.stt_connection_params)}"
        
        # TTS Configuration (Murf)
        self.tts_client = Murf(
            api_key="ap2_d09dfb5d-d2b5-45c0-9dcc-b95b8e27e16c"
        )
        
        # Audio Configuration
        self.frames_per_buffer = 800  # 50ms of audio
        self.sample_rate = 16000
        self.channels = 1
        self.format = pyaudio.paInt16
        
        # State variables
        self.audio = None
        self.stream = None
        self.ws_app = None
        self.audio_thread = None
        self.stop_event = threading.Event()
        self.is_listening = False
        self.current_transcript = ""
        self.transcript_callback = None
        self.pronunciation_errors = []
        
        # Recording variables
        self.recorded_frames = []
        self.recording_lock = threading.Lock()
        
    def start_listening(self, callback: Callable[[str, List[str]], None]):
        """Start listening for speech input."""
        if self.is_listening:
            print("Already listening...")
            return
        
        self.transcript_callback = callback
        self.is_listening = True
        self.stop_event.clear()
        self.current_transcript = ""
        self.pronunciation_errors = []
        
        # Initialize PyAudio
        self.audio = pyaudio.PyAudio()
        
        try:
            # Open microphone stream
            self.stream = self.audio.open(
                input=True,
                frames_per_buffer=self.frames_per_buffer,
                channels=self.channels,
                format=self.format,
                rate=self.sample_rate,
            )
            print("Listening... Speak now!")
            
            # Create WebSocket connection
            self.ws_app = websocket.WebSocketApp(
                self.stt_api_endpoint,
                header={"Authorization": self.stt_api_key},
                on_open=self._on_stt_open,
                on_message=self._on_stt_message,
                on_error=self._on_stt_error,
                on_close=self._on_stt_close,
            )
            
            # Start WebSocket in separate thread
            ws_thread = threading.Thread(target=self.ws_app.run_forever)
            ws_thread.daemon = True
            ws_thread.start()
            
        except Exception as e:
            print(f"Error starting audio input: {e}")
            self.stop_listening()
    
    def stop_listening(self):
        """Stop listening for speech input."""
        if not self.is_listening:
            return
        
        self.is_listening = False
        self.stop_event.set()
        
        # Send termination message
        if self.ws_app and self.ws_app.sock and self.ws_app.sock.connected:
            try:
                terminate_message = {"type": "Terminate"}
                self.ws_app.send(json.dumps(terminate_message))
                time.sleep(1)  # Give time for final transcript
            except Exception as e:
                print(f"Error sending termination: {e}")
        
        # Close WebSocket
        if self.ws_app:
            self.ws_app.close()
        
        # Clean up audio resources
        if self.stream and self.stream.is_active():
            self.stream.stop_stream()
        if self.stream:
            self.stream.close()
        if self.audio:
            self.audio.terminate()
        
        print("Stopped listening")
    
    def speak_text(self, text: str) -> str:
        """Convert text to speech and return the audio file path."""
        try:
            print(f"Speaking: {text}")
            
            # Generate speech using Murf TTS
            audio_response = self.tts_client.text_to_speech.generate(
                format="MP3",
                sample_rate=44100.0,
                text=text,
                voice_id="en-US-natalie",
            )
            
            # Create output filename
            timestamp = datetime.now().strftime("%Y%m%d_%H%M%S")
            output_filename = f"bot_response_{timestamp}.mp3"
            output_path = Path(__file__).parent / output_filename
            
            # Save audio file
            if isinstance(audio_response.audio_file, str):
                # Download from URL
                response = requests.get(audio_response.audio_file)
                response.raise_for_status()
                with open(output_path, 'wb') as audio_file:
                    audio_file.write(response.content)
            else:
                # Save binary data
                with open(output_path, 'wb') as audio_file:
                    audio_file.write(audio_response.audio_file)
            
            # Play the audio (you might want to use pygame or similar for better audio playback)
            self._play_audio_file(str(output_path))
            
            return str(output_path)
            
        except Exception as e:
            print(f"Error generating speech: {e}")
            return None
    
    def _play_audio_file(self, file_path: str):
        """Play an audio file. This is a simple implementation."""
        try:
            # For Windows, use the default audio player
            if os.name == 'nt':
                os.system(f'start "" "{file_path}"')
            else:
                # For other systems, you might need to install and use pygame or similar
                print(f"Audio file saved to: {file_path}")
                print("Please play the audio file manually or install pygame for automatic playback")
        except Exception as e:
            print(f"Error playing audio: {e}")
    
    def _on_stt_open(self, ws):
        """Handle STT WebSocket connection open."""
        print("STT connection established")
        
        def stream_audio():
            while not self.stop_event.is_set() and self.is_listening:
                try:
                    audio_data = self.stream.read(self.frames_per_buffer, exception_on_overflow=False)
                    
                    # Store for recording
                    with self.recording_lock:
                        self.recorded_frames.append(audio_data)
                    
                    # Send to STT service
                    ws.send(audio_data, websocket.ABNF.OPCODE_BINARY)
                except Exception as e:
                    print(f"Error streaming audio: {e}")
                    break
        
        self.audio_thread = threading.Thread(target=stream_audio)
        self.audio_thread.daemon = True
        self.audio_thread.start()
    
    def _on_stt_message(self, ws, message):
        """Handle STT WebSocket messages."""
        try:
            data = json.loads(message)
            msg_type = data.get('type')
            
            if msg_type == "Turn":
                transcript = data.get('transcript', '')
                formatted = data.get('turn_is_formatted', False)
                
                if formatted and transcript:
                    self.current_transcript = transcript
                    print(f"You said: {transcript}")
                    
                    # Analyze for pronunciation errors
                    errors = self._analyze_pronunciation(transcript)
                    
                    # Call the callback with transcript and errors
                    if self.transcript_callback:
                        self.transcript_callback(transcript, errors)
                        
        except Exception as e:
            print(f"Error handling STT message: {e}")
    
    def _on_stt_error(self, ws, error):
        """Handle STT WebSocket errors."""
        print(f"STT Error: {error}")
        self.stop_event.set()
    
    def _on_stt_close(self, ws, close_status_code, close_msg):
        """Handle STT WebSocket connection close."""
        print(f"STT connection closed: {close_status_code}")
        self.stop_event.set()
    
    def _analyze_pronunciation(self, transcript: str) -> List[str]:
        """Analyze transcript for potential pronunciation errors."""
        errors = []
        
        # Common pronunciation error patterns
        pronunciation_patterns = {
            r'\bth\w*': 'th sounds (try placing tongue between teeth)',
            r'\b\w*r\w*': 'r sounds (try rolling tongue)',
            r'\b\w*l\w*': 'l sounds (try touching tongue to roof of mouth)',
            r'\b\w*v\w*': 'v sounds (try biting lower lip gently)',
            r'\b\w*w\w*': 'w sounds (try rounding lips)',
        }
        
        # Check for common mispronunciations
        common_errors = {
            'aks': 'ask',
            'aksed': 'asked',
            'ax': 'ask',
            'fustrated': 'frustrated',
            'libary': 'library',
            'nucular': 'nuclear',
            'realtor': 'real-tor',
            'sherbert': 'sherbet',
            'supposably': 'supposedly',
            'warsh': 'wash'
        }
        
        transcript_lower = transcript.lower()
        
        # Check for common mispronunciations
        for error, correct in common_errors.items():
            if error in transcript_lower:
                errors.append(f"Possible mispronunciation: '{error}' should be '{correct}'")
        
        # Check for difficult sound patterns
        for pattern, advice in pronunciation_patterns.items():
            if re.search(pattern, transcript_lower):
                # This is just a basic check - in a real system, you'd use more sophisticated analysis
                pass
        
        return errors
    
    def save_conversation_audio(self, filename: str = None) -> str:
        """Save the recorded conversation audio to a WAV file."""
        if not self.recorded_frames:
            print("No audio data recorded.")
            return None
        
        if not filename:
            timestamp = datetime.now().strftime("%Y%m%d_%H%M%S")
            filename = f"conversation_audio_{timestamp}.wav"
        
        try:
            with wave.open(filename, 'wb') as wf:
                wf.setnchannels(self.channels)
                wf.setsampwidth(2)  # 16-bit = 2 bytes
                wf.setframerate(self.sample_rate)
                
                with self.recording_lock:
                    wf.writeframes(b''.join(self.recorded_frames))
            
            print(f"Conversation audio saved to: {filename}")
            return filename
            
        except Exception as e:
            print(f"Error saving audio file: {e}")
            return None
