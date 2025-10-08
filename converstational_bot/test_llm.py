"""
Test script for LLM Integration
Tests the Gemini 2.0 Flash integration with the conversational bot.
"""

import sys
import os
from pathlib import Path

# Add current directory to path
sys.path.append(os.path.dirname(os.path.abspath(__file__)))

from llm_manager import LLMManager
from conversation_manager import ConversationManager
import config

def test_llm_basic():
    """Test basic LLM functionality."""
    print("Testing LLM Manager Basic Functionality")
    print("=" * 50)
    
    try:
        # Check if API key is set
        if config.GEMINI_API_KEY == "your_gemini_api_key_here":
            print("ERROR: Please set your Gemini API key in the .env file or config.py")
            print("\n1. Get your API key from: https://makersuite.google.com/app/apikey")
            print("2. Create a .env file in the converstational_bot directory")
            print("3. Add: GEMINI_API_KEY=your_actual_key_here")
            return False
        
        # Initialize LLM Manager
        llm = LLMManager()
        print("LLM Manager initialized successfully")
        
        # Test coffee shop scenario
        print("\nTesting Coffee Shop Scenario:")
        print("-" * 40)
        
        greeting = llm.start_conversation("coffee_shop")
        print(f"Bot: {greeting}")
        
        # Simulate user input
        user_input = "I'd like a large latte please"
        print(f"\nUser: {user_input}")
        
        response = llm.generate_response(user_input)
        print(f"Bot: {response}")
        
        # Check conversation history
        history = llm.get_conversation_history()
        print(f"\nConversation history: {len(history)} messages")
        
        print("\nLLM Basic Test: PASSED")
        return True
        
    except Exception as e:
        print(f"\nLLM Basic Test: FAILED")
        print(f"Error: {e}")
        return False

def test_conversation_manager():
    """Test Conversation Manager with LLM."""
    print("\n\nTesting Conversation Manager with LLM")
    print("=" * 50)
    
    try:
        if config.GEMINI_API_KEY == "your_gemini_api_key_here":
            print("SKIPPED: API key not configured")
            return True
        
        # Initialize Conversation Manager
        manager = ConversationManager()
        print("Conversation Manager initialized successfully")
        
        # Test defective item scenario
        print("\nTesting Defective Item Scenario:")
        print("-" * 40)
        
        initial = manager.start_conversation("defective_item")
        print(f"Bot: {initial}")
        
        # Simulate conversation
        test_inputs = [
            "I want to return this broken phone",
            "My order number is 12345"
        ]
        
        for user_input in test_inputs:
            print(f"\nUser: {user_input}")
            response = manager.generate_response(user_input)
            print(f"Bot: {response}")
        
        # Get report
        report = manager.get_conversation_report()
        print(f"\nTotal exchanges: {report['total_exchanges']}")
        print(f"Messages in history: {len(report['conversation_history'])}")
        
        print("\nConversation Manager Test: PASSED")
        return True
        
    except Exception as e:
        print(f"\nConversation Manager Test: FAILED")
        print(f"Error: {e}")
        return False

def test_all_scenarios():
    """Test all three scenarios."""
    print("\n\nTesting All Scenarios")
    print("=" * 50)
    
    if config.GEMINI_API_KEY == "your_gemini_api_key_here":
        print("SKIPPED: API key not configured")
        return True
    
    scenarios = ["defective_item", "coffee_shop", "manager_developer"]
    llm = LLMManager()
    
    for scenario in scenarios:
        try:
            print(f"\nTesting {scenario}...")
            greeting = llm.start_conversation(scenario)
            print(f"Greeting: {greeting[:80]}...")
            print(f"{scenario}: PASSED")
        except Exception as e:
            print(f"{scenario}: FAILED - {e}")
            return False
    
    print("\nAll Scenarios Test: PASSED")
    return True

def test_conversation_flow():
    """Test complete conversation flow."""
    print("\n\nTesting Complete Conversation Flow")
    print("=" * 50)
    
    if config.GEMINI_API_KEY == "your_gemini_api_key_here":
        print("SKIPPED: API key not configured")
        return True
    
    try:
        llm = LLMManager()
        
        # Start conversation
        llm.start_conversation("coffee_shop")
        
        # Simulate full conversation
        test_inputs = [
            "I'd like a coffee",
            "Medium size please",
            "No, that's all",
            "Thank you"
        ]
        
        for i, user_input in enumerate(test_inputs, 1):
            response = llm.generate_response(user_input)
            print(f"Exchange {i}: User -> Bot")
            
            # Check if should end
            if llm.should_end_conversation():
                print(f"Conversation ended after {i} exchanges (max turns reached)")
                break
            
            if llm.check_end_phrases(user_input):
                print(f"Conversation ended after {i} exchanges (end phrase detected)")
                break
        
        # Get conversation dict
        conv_dict = llm.get_conversation_dict()
        print(f"\nFinal conversation:")
        print(f"- Scenario: {conv_dict['scenario']}")
        print(f"- Total messages: {len(conv_dict['conversation_history'])}")
        print(f"- Total exchanges: {conv_dict['total_exchanges']}")
        
        print("\nConversation Flow Test: PASSED")
        return True
        
    except Exception as e:
        print(f"\nConversation Flow Test: FAILED")
        print(f"Error: {e}")
        return False

def main():
    """Run all tests."""
    print("LLM INTEGRATION TEST SUITE")
    print("=" * 60)
    print("Testing Gemini 2.0 Flash integration...")
    print()
    
    tests = [
        test_llm_basic,
        test_conversation_manager,
        test_all_scenarios,
        test_conversation_flow
    ]
    
    passed = 0
    failed = 0
    
    for test in tests:
        try:
            if test():
                passed += 1
            else:
                failed += 1
        except Exception as e:
            print(f"\nTest {test.__name__} crashed: {e}")
            failed += 1
    
    print("\n" + "=" * 60)
    print(f"TEST RESULTS: {passed} passed, {failed} failed")
    
    if failed == 0:
        print("All tests passed! LLM integration is working correctly.")
    else:
        print("Some tests failed. Please check the errors above.")
        print("\nCommon issues:")
        print("1. API key not configured in .env file")
        print("2. Missing dependencies (run: pip install -r requirements.txt)")
        print("3. Network connectivity issues")
    
    return failed == 0

if __name__ == "__main__":
    success = main()
    sys.exit(0 if success else 1)
