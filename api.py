from fastapi import FastAPI, HTTPException, Query
from main import PronunciationAssistant
import random

# --- API App Initialization ---
app = FastAPI(
    title="Trilingual Pronunciation API",
    description="Get phonetic breakdowns for English, Hindi, and Telugu words.",
    version="2.0.0",
)

# --- Core Logic and Data ---
assistant = PronunciationAssistant()

ENGLISH_WORDS = [
    "ubiquitous", "ephemeral", "mellifluous", "serendipity", "cacophony",
    "quintessential", "plethora", "idiosyncratic", "magnanimous", "ostentatious"
]
HINDI_WORDS = [
    "नमस्ते", "धन्यवाद", "कंप्यूटर", "अविश्वसनीय", "शुभकामनाएं",
    "अंतरिक्ष", "पर्यावरण", "गणतंत्र", "स्वतंत्रता", "वैज्ञानिक",
    "प्रौद्योगिकी", "संस्कृति", "जिज्ञासा", "साहित्य", "कर्తव्य",
    "अनुशासन", "ब्रह्मांड", "संविधान", "जिम्मेदारी", "वातावरण"
]
TELUGU_WORDS = [
    "నమస్కారం", "ధన్యవాదాలు", "కంప్యూటర్", "అద్భుతం", "శుభాకాంక్షలు",
    "సాంకేతికత", "సంస్కృతి", "స్వాతంత్ర్యం", "విశ్వం", "పర్యావరణం"
]


# --- API Endpoints ---

@app.get("/")
def read_root():
    """A welcome message to confirm the API is running."""
    return {"message": "Welcome! Go to /docs for the API documentation."}


@app.get("/breakdown")
def get_specific_word_breakdown(
    word: str = Query(..., min_length=1, max_length=50, description="The word to be analyzed (English, Hindi, or Telugu).")
):
    """
    Provides the pronunciation breakdown for a specific word.
    The API automatically detects the language of the provided word.
    """
    try:
        return assistant.breakdown_word(word.strip())
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"An error occurred: {e}")


@app.get("/random-words")
def get_random_words_of_the_day():
    """
    Provides a set of three random words, one from each supported language.
    """
    try:
        # Select one random word from each list
        random_english = random.choice(ENGLISH_WORDS)
        random_hindi = random.choice(HINDI_WORDS)
        random_telugu = random.choice(TELUGU_WORDS)

        # Get the breakdown for each word
        english_breakdown = assistant.breakdown_word(random_english)
        hindi_breakdown = assistant.breakdown_word(random_hindi)
        telugu_breakdown = assistant.breakdown_word(random_telugu)
        
        # Return a structured response
        return {
            "english": english_breakdown,
            "hindi": hindi_breakdown,
            "telugu": telugu_breakdown
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"An error occurred: {e}")