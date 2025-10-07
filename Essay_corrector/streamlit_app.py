import streamlit as st
import requests
import json
import time
from datetime import datetime
import os

# Page configuration
st.set_page_config(
    page_title="Essay Corrector",
    page_icon="📝",
    layout="wide",
    initial_sidebar_state="expanded"
)

# Custom CSS for better styling
st.markdown("""
<style>
    .main-header {
        font-size: 3rem;
        font-weight: bold;
        text-align: center;
        margin-bottom: 2rem;
        background: linear-gradient(90deg, #667eea 0%, #764ba2 100%);
        -webkit-background-clip: text;
        -webkit-text-fill-color: transparent;
        background-clip: text;
    }
    
    .success-box {
        padding: 1rem;
        border-radius: 0.5rem;
        background-color: #d4edda;
        border: 1px solid #c3e6cb;
        color: #155724;
        margin: 1rem 0;
    }
    
    .error-box {
        padding: 1rem;
        border-radius: 0.5rem;
        background-color: #f8d7da;
        border: 1px solid #f5c6cb;
        color: #721c24;
        margin: 1rem 0;
    }
    
    .info-box {
        padding: 1rem;
        border-radius: 0.5rem;
        background-color: #d1ecf1;
        border: 1px solid #bee5eb;
        color: #0c5460;
        margin: 1rem 0;
    }
    
    .metric-card {
        background-color: #f8f9fa;
        padding: 1rem;
        border-radius: 0.5rem;
        border-left: 4px solid #007bff;
        margin: 0.5rem 0;
    }
    
    .stTextArea > div > div > textarea {
        min-height: 200px;
    }
</style>
""", unsafe_allow_html=True)

# Initialize session state
if 'api_url' not in st.session_state:
    st.session_state.api_url = "http://localhost:8000"
if 'jwt_token' not in st.session_state:
    st.session_state.jwt_token = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IkpvaG4gRG9lIiwiaWF0IjoxNTE2MjM5MDIyfQ.SflKxwRJSMeKKF2QT4fwpMeJf36POk6yJV_adQssw5c"

def check_api_health():
    """Check if the API is running"""
    try:
        response = requests.get(f"{st.session_state.api_url}/health", timeout=5)
        return response.status_code == 200
    except:
        return False

def correct_essay_api(essay, jwt_token):
    """Call the essay correction API"""
    try:
        response = requests.post(
            f"{st.session_state.api_url}/correct-essay",
            json={
                "essay": essay,
                "jwt_token": jwt_token
            },
            timeout=30
        )
        return response.json(), response.status_code
    except requests.exceptions.Timeout:
        return {"error": "Request timeout - the essay might be too long or the server is slow"}, 408
    except requests.exceptions.ConnectionError:
        return {"error": "Cannot connect to the API server. Make sure it's running on the correct URL."}, 503
    except Exception as e:
        return {"error": f"Unexpected error: {str(e)}"}, 500

def main():
    # Header
    st.markdown('<h1 class="main-header">📝 Essay Corrector</h1>', unsafe_allow_html=True)
    st.markdown("### AI-Powered Essay Correction with Grammar and Spelling Analysis")
    
    # Sidebar
    with st.sidebar:
        st.header("⚙️ Configuration")
        
        # API URL configuration
        api_url = st.text_input(
            "API URL",
            value=st.session_state.api_url,
            help="URL of the Essay Corrector API server"
        )
        st.session_state.api_url = api_url
        
        # JWT Token configuration
        jwt_token = st.text_input(
            "JWT Token",
            value=st.session_state.jwt_token,
            type="password",
            help="JWT token for authentication"
        )
        st.session_state.jwt_token = jwt_token
        
        # API Health Check
        st.subheader("🔍 API Status")
        if st.button("Check API Health"):
            with st.spinner("Checking API..."):
                if check_api_health():
                    st.success("✅ API is running")
                else:
                    st.error("❌ API is not responding")
        
        # Instructions
        st.subheader("📖 How to Use")
        st.markdown("""
        1. **Enter your essay** in the text area
        2. **Configure API settings** in this sidebar
        3. **Click 'Correct Essay'** to analyze
        4. **Review results** and corrections
        """)
        
        # Sample essays
        st.subheader("📚 Sample Essays")
        if st.button("Load Sample Essay"):
            sample_essay = """
            Learning is reely importent for every one. You shud always tri to get nu knowledge, becaus it makes you smert. For exampel, I lerned how too bake a choklat kake last week. It was difikult at first, but know I practice every day! My teecher says that consistency helps. It is esential to keep your brane active, or it will become lazzy. We must nevver stop questing and exploring the world. Their is so much too see, and reading books is one way too sea it. This is why I think edjucashun is the best thing, for peeple. It gives oppertunities.
            """
            st.session_state.sample_essay = sample_essay
    
    # Main content area
    col1, col2 = st.columns([1, 1])
    
    with col1:
        st.subheader("📝 Enter Your Essay")
        
        # Essay input
        essay_text = st.text_area(
            "Essay Text",
            value=st.session_state.get('sample_essay', ''),
            height=300,
            placeholder="Enter your essay here... The AI will check for spelling and grammatical errors.",
            help="Minimum 10 characters, maximum 10,000 characters"
        )
        
        # Essay statistics
        if essay_text:
            word_count = len(essay_text.split())
            char_count = len(essay_text)
            st.info(f"📊 **Statistics:** {word_count} words, {char_count} characters")
        
        # Correct button
        if st.button("🔍 Correct Essay", type="primary", use_container_width=True):
            if not essay_text.strip():
                st.error("Please enter an essay to correct.")
            elif len(essay_text.strip()) < 10:
                st.error("Essay must be at least 10 characters long.")
            elif len(essay_text) > 10000:
                st.error("Essay must be less than 10,000 characters.")
            else:
                with st.spinner("🤖 AI is analyzing your essay..."):
                    result, status_code = correct_essay_api(essay_text, st.session_state.jwt_token)
                
                if status_code == 200:
                    st.session_state.correction_result = result
                    st.success("✅ Essay correction completed!")
                else:
                    st.error(f"❌ Error: {result.get('error', 'Unknown error')}")
    
    with col2:
        st.subheader("📊 Results")
        
        if 'correction_result' in st.session_state:
            result = st.session_state.correction_result
            
            # Display corrected essay
            st.markdown("### ✏️ Corrected Essay")
            st.markdown('<div class="success-box">', unsafe_allow_html=True)
            st.text_area(
                "Corrected Version",
                value=result.get('corrected_essay', ''),
                height=200,
                disabled=True,
                key="corrected_essay_display"
            )
            st.markdown('</div>', unsafe_allow_html=True)
            
            # Copy button for corrected essay
            if st.button("📋 Copy Corrected Essay"):
                st.write("Corrected essay copied to clipboard!")
            
            # Display report
            st.markdown("### 📋 Analysis Report")
            st.markdown('<div class="info-box">', unsafe_allow_html=True)
            st.write(result.get('essay_report', 'No report available'))
            st.markdown('</div>', unsafe_allow_html=True)
            
            # Token usage information
            if 'token_usage' in result:
                st.markdown("### 📈 Token Usage")
                col_a, col_b = st.columns(2)
                with col_a:
                    st.metric("Prompt Tokens", result['token_usage'].get('prompt_tokens', 0))
                with col_b:
                    st.metric("Completion Tokens", result['token_usage'].get('completion_tokens', 0))
            
            # Error indicator
            if result.get('error', False):
                st.markdown('<div class="error-box">', unsafe_allow_html=True)
                st.warning("⚠️ This correction was completed with errors. Please check the report.")
                st.markdown('</div>', unsafe_allow_html=True)
        else:
            st.info("👈 Enter an essay and click 'Correct Essay' to see results here.")
    
    # Footer
    st.markdown("---")
    st.markdown("""
    <div style='text-align: center; color: #666;'>
        <p>🤖 Powered by Gemini 2.0 Flash | 🚀 Built with Streamlit | 📝 Essay Corrector API</p>
        <p>Made with ❤️ for better writing</p>
    </div>
    """, unsafe_allow_html=True)

if __name__ == "__main__":
    main()
