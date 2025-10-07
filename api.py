# FILE: api.py
from fastapi import FastAPI, HTTPException, Query
from main import PronunciationAssistant
import random
import os
import base64

# --- API App Initialization ---
app = FastAPI(
    title="Trilingual Pronunciation API",
    description="Get phonetic breakdowns with embedded audio for English, Hindi, and Telugu words.",
    version="2.2.0",
)

# --- Core Logic and Data ---
assistant = PronunciationAssistant()

ENGLISH_WORDS = [
    "ubiquitous", "ephemeral", "mellifluous", "serendipity", "cacophony",
    "quintessential", "plethora", "idiosyncratic", "magnanimous", "ostentatious",
    "perspicacious", "pulchritudinous", "sesquipedalian", "ebullient", "loquacious"
]
HINDI_WORDS = [
    "नमस्ते", "धन्यवाद", "कंप्यूटर", "अविश्वसनीय", "शुभकामनाएं",
    "अंतरिक्ष", "पर्यावरण", "गणतंत्र", "स्वतंत्रता", "वैज्ञानिक",
    "प्रौद्योगिकी", "संस्कृति", "जिज्ञासा", "సాहित्य", "कर्तव्य"
]
TELUGU_WORDS = [
    "నమస్కారం", "ధన్యవాదాలు", "కంప్యూటర్", "అద్భుతం", "శుభాకాంక్షలు",
    "సాంకేతికత", "సంస్కృతి", "స్వాతంత్ర్యం", "విశ్వం", "పర్యావరణం",
    "ప్రజాస్వామ్యం", "విద్యార్థి", "పుస్తకం", "సంగీతం", "రాజ్యాంగం"
]


def _process_breakdown_for_api(breakdown_data):
    """
    Helper function to convert all audio paths in the breakdown data to Base64.
    """
    full_audio_path = breakdown_data.get("full_audio_path")
    if full_audio_path and os.path.exists(full_audio_path):
        with open(full_audio_path, "rb") as f:
            audio_bytes = f.read()
            breakdown_data["full_audio_base64"] = base64.b64encode(audio_bytes).decode("utf-8")
    
    if "syllables" in breakdown_data:
        for syl in breakdown_data["syllables"]:
            syl_audio_path = syl.get("audio_path")
            if syl_audio_path and os.path.exists(syl_audio_path):
                with open(syl_audio_path, "rb") as f:
                    syl_audio_bytes = f.read()
                    syl["audio_base64"] = base64.b64encode(syl_audio_bytes).decode("utf-8")
    return breakdown_data

# --- API Endpoints ---
@app.get("/")
def read_root():
    return {"message": "Welcome! Go to /docs for API documentation."}


@app.get("/breakdown")
def get_specific_word_breakdown(
    word: str = Query(..., description="The word to analyze (English, Hindi, or Telugu).")
):
    """
    Provides a pronunciation breakdown with embedded Base64 audio for any word.
    """
    try:
        raw_result = assistant.breakdown_word(word.strip())
        api_response = _process_breakdown_for_api(raw_result)
        return api_response
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"An error occurred: {e}")


@app.get("/random-words")
def get_random_words_of_the_day():
    """
    Provides a set of three random words (EN, HI, TE) with their breakdowns.
    """
    try:
        en_result = assistant.breakdown_word(random.choice(ENGLISH_WORDS))
        hi_result = assistant.breakdown_word(random.choice(HINDI_WORDS))
        te_result = assistant.breakdown_word(random.choice(TELUGU_WORDS))

        return {
            "english": _process_breakdown_for_api(en_result),
            "hindi": _process_breakdown_for_api(hi_result),
            "telugu": _process_breakdown_for_api(te_result)
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"An error occurred: {e}")
