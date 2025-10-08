"""
Test script to verify fluency score is now an integer
"""

import sys
from pathlib import Path
sys.path.insert(0, str(Path(__file__).parent))

from report_generator import ReportGenerator

def test_fluency_score():
    """Test that fluency score is an integer."""
    
    print("🧪 Testing Fluency Score Fix...")
    print("=" * 50)
    
    # Initialize report generator
    report_gen = ReportGenerator(use_llm=False)
    
    # Test messages
    test_messages = [
        "Hi there",
        "I would like a coffee please",
        "That sounds great"
    ]
    
    print(f"Test messages: {test_messages}")
    
    # Test fluency analysis
    fluency_analysis = report_gen._analyze_fluency(test_messages)
    
    print(f"\n📊 Fluency Analysis Results:")
    print(f"Total words: {fluency_analysis['total_words']}")
    print(f"Average words per message: {fluency_analysis['avg_words_per_message']}")
    print(f"Sentence structure variety: {fluency_analysis['sentence_structure_variety']}")
    print(f"Fluency score: {fluency_analysis['fluency_score']}")
    print(f"Fluency score type: {type(fluency_analysis['fluency_score'])}")
    
    # Check if fluency score is an integer
    if isinstance(fluency_analysis['fluency_score'], int):
        print("\n✅ SUCCESS! Fluency score is now an integer.")
    else:
        print(f"\n❌ ISSUE! Fluency score is still a {type(fluency_analysis['fluency_score'])}: {fluency_analysis['fluency_score']}")
    
    # Test with different message lengths
    print(f"\n🧪 Testing with different message lengths...")
    
    test_cases = [
        ["Hi"],  # Very short
        ["Hello there"],  # Short
        ["I would like to order a large coffee please"],  # Medium
        ["I would like to order a large coffee with extra foam and a shot of vanilla please"],  # Long
    ]
    
    for i, messages in enumerate(test_cases, 1):
        fluency = report_gen._analyze_fluency(messages)
        print(f"  Test {i}: {fluency['fluency_score']}/100 (avg: {fluency['avg_words_per_message']} words)")
    
    return fluency_analysis

if __name__ == "__main__":
    try:
        result = test_fluency_score()
    except Exception as e:
        print(f"\n❌ Test failed with error: {e}")
        import traceback
        traceback.print_exc()
