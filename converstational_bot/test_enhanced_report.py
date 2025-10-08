"""
Test script for LLM-enhanced report generation
Demonstrates the improved grammar, spelling, and error detection.
"""

import sys
from datetime import datetime
from report_generator import ReportGenerator

# Test conversation data with intentional errors
test_conversation = {
    "scenario": "Returning a Defective Item (Polite)",
    "conversation_history": [
        {
            "timestamp": datetime.now().isoformat(),
            "speaker": "bot",
            "message": "Hello! How can I help you today?"
        },
        {
            "timestamp": datetime.now().isoformat(),
            "speaker": "user",
            "message": "I want to return this brocken phone, its not working properly"
        },
        {
            "timestamp": datetime.now().isoformat(),
            "speaker": "bot",
            "message": "I understand. Can you provide your order number?"
        },
        {
            "timestamp": datetime.now().isoformat(),
            "speaker": "user",
            "message": "My order number are 12345 and I needs a refund"
        },
        {
            "timestamp": datetime.now().isoformat(),
            "speaker": "bot",
            "message": "I'll process that for you."
        },
        {
            "timestamp": datetime.now().isoformat(),
            "speaker": "user",
            "message": "Thank you for you're help, I really apreciate it"
        }
    ],
    "pronunciation_analysis": {
        "errors": []
    }
}

def test_basic_report():
    """Test basic report generation (without LLM)."""
    print("=" * 60)
    print("TEST 1: Basic Report Generation (No LLM)")
    print("=" * 60)
    
    generator = ReportGenerator(use_llm=False)
    report = generator.analyze_conversation(test_conversation)
    
    print(f"\nOverall Score: {report['conversation_metadata']['overall_score']}/100")
    print(f"Grammar Errors Detected: {report['grammar_analysis']['total_errors']}")
    print(f"LLM Enhanced: {report['conversation_metadata'].get('llm_enhanced', False)}")
    
    if report['grammar_analysis']['error_details']:
        print("\nGrammar Errors Found:")
        for error in report['grammar_analysis']['error_details'][:3]:
            print(f"  - {error['category']}: {error.get('suggestion', 'No suggestion')}")
    
    print("\n✓ Basic report generated successfully\n")

def test_llm_enhanced_report():
    """Test LLM-enhanced report generation."""
    print("=" * 60)
    print("TEST 2: LLM-Enhanced Report Generation")
    print("=" * 60)
    
    generator = ReportGenerator(use_llm=True)
    report = generator.analyze_conversation(test_conversation)
    
    print(f"\nOverall Score: {report['conversation_metadata']['overall_score']}/100")
    print(f"Grammar Errors Detected: {report['grammar_analysis']['total_errors']}")
    print(f"LLM Enhanced: {report['conversation_metadata'].get('llm_enhanced', False)}")
    print(f"LLM Detected Errors: {report['grammar_analysis'].get('llm_detected_errors', 0)}")
    
    # Show LLM-detected errors
    if report['grammar_analysis']['error_details']:
        print("\nDetailed Grammar & Spelling Errors:")
        for error in report['grammar_analysis']['error_details']:
            if error.get('source') == 'llm':
                print(f"\n  Message {error['message_index']}:")
                print(f"    Error: {error['error']}")
                print(f"    Correction: {error['correction']}")
                print(f"    Type: {error['category']}")
                print(f"    Explanation: {error['suggestion']}")
    
    # Show LLM insights
    if report.get('llm_insights'):
        print("\n📊 LLM Insights:")
        for i, insight in enumerate(report['llm_insights'], 1):
            print(f"  {i}. {insight}")
    
    # Show pronunciation tips
    if report['pronunciation_analysis'].get('llm_pronunciation_tips'):
        print("\n🗣️ Pronunciation Tips:")
        for tip in report['pronunciation_analysis']['llm_pronunciation_tips']:
            print(f"  - {tip['word']}: {tip['tip']}")
            print(f"    Phonetic: {tip['phonetic']}")
    
    print("\n✓ LLM-enhanced report generated successfully\n")

def compare_reports():
    """Compare basic vs LLM-enhanced reports."""
    print("=" * 60)
    print("TEST 3: Comparison - Basic vs LLM-Enhanced")
    print("=" * 60)
    
    # Generate both reports
    basic_gen = ReportGenerator(use_llm=False)
    llm_gen = ReportGenerator(use_llm=True)
    
    basic_report = basic_gen.analyze_conversation(test_conversation)
    llm_report = llm_gen.analyze_conversation(test_conversation)
    
    print("\n📊 Comparison Results:")
    print(f"\nBasic Report:")
    print(f"  - Total Errors: {basic_report['grammar_analysis']['total_errors']}")
    print(f"  - Grammar Score: {basic_report['grammar_analysis']['grammar_score']}/100")
    
    print(f"\nLLM-Enhanced Report:")
    print(f"  - Total Errors: {llm_report['grammar_analysis']['total_errors']}")
    print(f"  - Grammar Score: {llm_report['grammar_analysis']['grammar_score']}/100")
    print(f"  - LLM Detected: {llm_report['grammar_analysis'].get('llm_detected_errors', 0)}")
    print(f"  - Additional Insights: {len(llm_report.get('llm_insights', []))}")
    
    improvement = llm_report['grammar_analysis']['total_errors'] - basic_report['grammar_analysis']['total_errors']
    print(f"\n✨ LLM found {improvement} additional errors!")
    print("✓ Comparison complete\n")

def main():
    """Run all tests."""
    print("\n🧪 TESTING LLM-ENHANCED REPORT GENERATION")
    print("=" * 60)
    print("This test uses intentional errors to demonstrate LLM capabilities:")
    print("  - 'brocken' (spelling)")
    print("  - 'its' vs 'it's' (grammar)")
    print("  - 'order number are' (subject-verb agreement)")
    print("  - 'you're' vs 'your' (grammar)")
    print("  - 'apreciate' (spelling)")
    print("=" * 60)
    print()
    
    try:
        # Test 1: Basic report
        test_basic_report()
        
        # Test 2: LLM-enhanced report
        test_llm_enhanced_report()
        
        # Test 3: Comparison
        compare_reports()
        
        print("=" * 60)
        print("✅ ALL TESTS COMPLETED SUCCESSFULLY!")
        print("=" * 60)
        print("\n💡 Key Benefits of LLM Enhancement:")
        print("  1. Pinpoints exact grammar errors with explanations")
        print("  2. Detects spelling mistakes accurately")
        print("  3. Provides context-aware corrections")
        print("  4. Offers pronunciation guidance")
        print("  5. Gives personalized insights")
        print("\n🎯 The LLM-enhanced report is much more detailed and helpful!")
        
    except Exception as e:
        print(f"\n❌ Test failed: {e}")
        import traceback
        traceback.print_exc()
        return False
    
    return True

if __name__ == "__main__":
    success = main()
    sys.exit(0 if success else 1)
