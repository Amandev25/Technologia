"""
Test script to verify LLM-enhanced reports in web UI backend
"""

import sys
from pathlib import Path

# Add current directory to path
sys.path.insert(0, str(Path(__file__).parent))

from report_generator import ReportGenerator
from conversation_manager import ConversationManager
import config

def test_report_generation():
    """Test that the report generator returns proper error arrays."""
    
    print("🧪 Testing Report Generation with LLM Enhancement...")
    print("=" * 60)
    
    # Initialize components
    print("\n1. Initializing components...")
    conv_manager = ConversationManager(api_key=config.GEMINI_API_KEY)
    report_generator = ReportGenerator(use_llm=True)
    
    # Start conversation
    print("\n2. Starting conversation (coffee_shop scenario)...")
    conv_manager.start_conversation("coffee_shop")
    
    # Simulate user messages with errors
    test_messages = [
        "Hi, I wants a large coffee please",  # Grammar error: "wants" should be "want"
        "Can I get an expresso shot?",  # Spelling error: "expresso" should be "espresso"
        "Yeah, that sounds gud"  # Spelling error: "gud" should be "good"
    ]
    
    print("\n3. Adding test messages with intentional errors:")
    for msg in test_messages:
        print(f"   User: {msg}")
        response = conv_manager.generate_response(msg)
        print(f"   Bot: {response[:50]}...")
    
    # Get conversation report
    print("\n4. Generating conversation report...")
    conversation_report = conv_manager.get_conversation_report()
    
    print(f"\n   Total messages: {len(conversation_report['conversation_history'])}")
    user_msg_count = sum(1 for m in conversation_report['conversation_history'] if m['speaker'] == 'user')
    print(f"   User messages: {user_msg_count}")
    
    # Analyze conversation
    print("\n5. Analyzing conversation with LLM...")
    detailed_report = report_generator.analyze_conversation(conversation_report)
    
    # Check results
    print("\n6. Checking analysis results:")
    print("-" * 60)
    
    grammar = detailed_report['grammar_analysis']
    pronunciation = detailed_report['pronunciation_analysis']
    
    print(f"\n📊 Grammar Analysis:")
    print(f"   Total errors: {grammar.get('total_errors', 0)}")
    print(f"   Grammar score: {grammar.get('grammar_score', 0)}")
    print(f"   LLM errors array length: {len(grammar.get('errors', []))}")
    print(f"   Spelling errors array length: {len(grammar.get('spelling_errors', []))}")
    print(f"   Insights array length: {len(grammar.get('insights', []))}")
    
    # Show detailed errors
    errors = grammar.get('errors', [])
    if errors:
        print(f"\n   ✅ Grammar Errors Found:")
        for i, error in enumerate(errors, 1):
            print(f"      {i}. Message #{error.get('message_index', 'N/A')}")
            print(f"         Type: {error.get('error_type', 'N/A')}")
            print(f"         Original: {error.get('original_text', 'N/A')}")
            print(f"         Correction: {error.get('correction', 'N/A')}")
    else:
        print("   ❌ No grammar errors in array (PROBLEM!)")
    
    spelling_errors = grammar.get('spelling_errors', [])
    if spelling_errors:
        print(f"\n   ✅ Spelling Errors Found:")
        for i, error in enumerate(spelling_errors, 1):
            print(f"      {i}. Message #{error.get('message_index', 'N/A')}")
            print(f"         Misspelled: {error.get('misspelled_word', 'N/A')}")
            print(f"         Correct: {error.get('correct_spelling', 'N/A')}")
    else:
        print("   ❌ No spelling errors in array (PROBLEM!)")
    
    insights = grammar.get('insights', [])
    if insights:
        print(f"\n   ✅ AI Insights Found:")
        for i, insight in enumerate(insights, 1):
            print(f"      {i}. {insight}")
    else:
        print("   ℹ️  No AI insights (may be empty)")
    
    print(f"\n📢 Pronunciation Analysis:")
    print(f"   Total errors: {pronunciation.get('total_pronunciation_errors', 0)}")
    print(f"   Pronunciation score: {pronunciation.get('pronunciation_score', 0)}")
    print(f"   Errors array length: {len(pronunciation.get('errors', []))}")
    print(f"   Likely errors array length: {len(pronunciation.get('likely_errors', []))}")
    
    likely_errors = pronunciation.get('likely_errors', [])
    if likely_errors:
        print(f"\n   ✅ Pronunciation Tips Found:")
        for i, error in enumerate(likely_errors, 1):
            print(f"      {i}. Word: {error.get('word', 'N/A')}")
            print(f"         Phonetic: {error.get('phonetic', 'N/A')}")
    else:
        print("   ℹ️  No pronunciation tips")
    
    # Final verdict
    print("\n" + "=" * 60)
    print("🏁 Test Results:")
    print("=" * 60)
    
    has_grammar_errors = len(grammar.get('errors', [])) > 0
    has_spelling_errors = len(grammar.get('spelling_errors', [])) > 0
    
    if has_grammar_errors or has_spelling_errors:
        print("✅ SUCCESS! Error arrays are populated correctly.")
        print("   The web UI should now display detailed errors.")
    else:
        print("❌ FAILED! Error arrays are still empty.")
        print("   Possible issues:")
        print("   1. LLM might not have detected errors")
        print("   2. Error merging might not be working")
        print("   3. LLM response parsing might have failed")
    
    print("\n💡 Next Steps:")
    print("   1. Start the web UI backend: cd web_ui && python backend_api.py")
    print("   2. Open index.html in your browser")
    print("   3. Complete a conversation with intentional errors")
    print("   4. Check if detailed errors appear in the report")
    
    return detailed_report

if __name__ == "__main__":
    try:
        report = test_report_generation()
    except Exception as e:
        print(f"\n❌ Test failed with error: {e}")
        import traceback
        traceback.print_exc()

