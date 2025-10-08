"""
Main Conversational Bot
Orchestrates the complete conversation flow with STT, TTS, conversation management, and reporting.
"""

import time
import threading
from datetime import datetime
from typing import Optional, Dict, Any
import json

from conversation_manager import ConversationManager
from audio_processor import AudioProcessor
from report_generator import ReportGenerator
import config

class ConversationalBot:
    def __init__(self, gemini_api_key: str = None):
        self.conversation_manager = ConversationManager(api_key=gemini_api_key or config.GEMINI_API_KEY)
        self.audio_processor = AudioProcessor()
        self.report_generator = ReportGenerator()
        
        self.is_running = False
        self.current_scenario = None
        self.conversation_active = False
        
    def start_conversation(self, scenario: str) -> str:
        """Start a new conversation with the specified scenario."""
        if scenario not in self.conversation_manager.scenario_contexts:
            available_scenarios = list(self.conversation_manager.scenario_contexts.keys())
            return f"Invalid scenario. Available scenarios: {', '.join(available_scenarios)}"
        
        self.current_scenario = scenario
        self.conversation_active = True
        
        # Start the conversation
        initial_message = self.conversation_manager.start_conversation(scenario)
        
        # Speak the initial message
        print(f"🤖 Bot: {initial_message}")
        self.audio_processor.speak_text(initial_message)
        
        return initial_message
    
    def run_conversation(self, scenario: str, max_turns: int = 10):
        """Run a complete conversation session."""
        print(f"\nStarting {scenario} conversation scenario...")
        print("=" * 60)
        
        # Start the conversation
        self.start_conversation(scenario)
        
        turn_count = 0
        self.is_running = True
        
        try:
            while self.is_running and turn_count < max_turns and self.conversation_active:
                print(f"\n--- Turn {turn_count + 1} ---")
                
                # Listen for user input
                print("Listening for your response...")
                user_input = self._listen_for_user_input()
                
                if not user_input:
                    print("No input received. Ending conversation.")
                    break
                
                # Generate bot response
                print("Generating response...")
                bot_response = self.conversation_manager.generate_response(
                    user_input, 
                    self.audio_processor.pronunciation_errors
                )
                
                # Speak the response
                print(f"Bot: {bot_response}")
                self.audio_processor.speak_text(bot_response)
                
                turn_count += 1
                
                # Check if conversation should end
                if self._should_end_conversation(user_input, turn_count):
                    break
                
                # Small delay between turns
                time.sleep(1)
        
        except KeyboardInterrupt:
            print("\nConversation interrupted by user")
        except Exception as e:
            print(f"\nError during conversation: {e}")
        finally:
            self._end_conversation()
    
    def _listen_for_user_input(self) -> Optional[str]:
        """Listen for user input using STT."""
        user_input = None
        input_received = threading.Event()
        
        def on_transcript_received(transcript: str, errors: list):
            nonlocal user_input
            user_input = transcript
            self.audio_processor.pronunciation_errors.extend(errors)
            input_received.set()
        
        # Start listening
        self.audio_processor.start_listening(on_transcript_received)
        
        # Wait for input with timeout
        if input_received.wait(timeout=30):  # 30 second timeout
            return user_input
        else:
            print("Timeout waiting for user input")
            self.audio_processor.stop_listening()
            return None
    
    def _should_end_conversation(self, user_input: str, turn_count: int) -> bool:
        """Determine if the conversation should end."""
        # Check if LLM thinks conversation should end
        if self.conversation_manager.llm_manager.should_end_conversation():
            return True
        
        # Check for end phrases
        if self.conversation_manager.llm_manager.check_end_phrases(user_input):
            return True
        
        return False
    
    def _end_conversation(self):
        """End the current conversation and generate reports."""
        print("\n" + "=" * 60)
        print("CONVERSATION ENDED - GENERATING REPORTS")
        print("=" * 60)
        
        self.is_running = False
        self.conversation_active = False
        
        # Stop audio processing
        self.audio_processor.stop_listening()
        
        # Save conversation audio
        audio_file = self.audio_processor.save_conversation_audio()
        if audio_file:
            print(f"Conversation audio saved: {audio_file}")
        
        # Generate conversation report
        conversation_report = self.conversation_manager.get_conversation_report()
        conversation_file = self.conversation_manager.save_report()
        print(f"Basic conversation report saved: {conversation_file}")
        
        # Generate detailed analysis report
        detailed_report = self.report_generator.analyze_conversation(conversation_report)
        detailed_file = self.report_generator.save_detailed_report(detailed_report)
        print(f"Detailed analysis report saved: {detailed_file}")
        
        # Display summary
        summary = self.report_generator.generate_summary_report(detailed_report)
        print(summary)
        
        # Save summary to file
        summary_file = f"conversation_summary_{datetime.now().strftime('%Y%m%d_%H%M%S')}.txt"
        with open(summary_file, 'w', encoding='utf-8') as f:
            f.write(summary)
        print(f"Summary report saved: {summary_file}")
        
        print("\nAll reports generated successfully!")
        print("Thank you for using the Conversational Bot!")
    
    def list_scenarios(self) -> Dict[str, str]:
        """List available conversation scenarios."""
        scenarios = {}
        for key, context in self.conversation_manager.scenario_contexts.items():
            scenarios[key] = context['name']
        return scenarios
    
    def get_scenario_info(self, scenario: str) -> Optional[Dict]:
        """Get detailed information about a specific scenario."""
        if scenario in self.conversation_manager.scenario_contexts:
            return self.conversation_manager.scenario_contexts[scenario]
        return None

def main():
    """Main function to run the conversational bot."""
    bot = ConversationalBot()
    
    print("WELCOME TO THE CONVERSATIONAL BOT")
    print("=" * 50)
    print("This bot will help you practice conversations in different scenarios.")
    print("It will analyze your speech, grammar, and provide improvement suggestions.")
    print()
    
    # Display available scenarios
    scenarios = bot.list_scenarios()
    print("Available conversation scenarios:")
    for i, (key, name) in enumerate(scenarios.items(), 1):
        print(f"{i}. {name} ({key})")
    
    print()
    
    # Get user choice
    while True:
        try:
            choice = input("Enter the number of the scenario you want to practice (1-3): ").strip()
            choice_num = int(choice)
            
            if 1 <= choice_num <= len(scenarios):
                scenario_key = list(scenarios.keys())[choice_num - 1]
                break
            else:
                print("Please enter a number between 1 and 3.")
        except ValueError:
            print("Please enter a valid number.")
    
    # Get scenario details
    scenario_info = bot.get_scenario_info(scenario_key)
    print(f"\nScenario: {scenario_info['name']}")
    print(f"Context: {scenario_info['context']}")
    print()
    
    # Confirm start
    confirm = input("Ready to start the conversation? (y/n): ").strip().lower()
    if confirm in ['y', 'yes']:
        print("\nStarting conversation...")
        print("Instructions:")
        print("- Speak clearly into your microphone")
        print("- The bot will respond with speech")
        print("- Say 'goodbye' or 'end conversation' to finish")
        print("- Press Ctrl+C to stop at any time")
        print()
        
        # Run the conversation
        bot.run_conversation(scenario_key)
    else:
        print("Conversation cancelled. Goodbye!")

if __name__ == "__main__":
    main()
