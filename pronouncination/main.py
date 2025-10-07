# FILE: main.py
import os
import pyphen
from g2p_en import G2p
from gtts import gTTS
import nltk
import re

try:
    nltk.data.find('corpora/cmudict.zip')
except nltk.downloader.DownloadError:
    nltk.download('cmudict')

from nltk.corpus import cmudict

class PronunciationAssistant:
    def __init__(self):
        self.syllable_dic_en = pyphen.Pyphen(lang='en_US')
        self.g2p_en = G2p()
        self.cmu_dict_en = cmudict.entries()

    def _detect_language(self, word):
        if re.search(r'[\u0900-\u097F]', word):
            return 'hindi'
        elif re.search(r'[\u0C00-\u0C7F]', word):
            return 'telugu'
        return 'english'

    def _get_hindi_aksharas(self, word):
        return re.findall(r'[\u0900-\u097F][\u093B-\u094D\u0962\u0963]*', word) or [word]
        
    def _get_telugu_aksharas(self, word):
        return re.findall(r'[\u0c00-\u0c7f][\u0c3e-\u0c56]*', word) or [word]

    def _get_english_syllables(self, word):
        return self.syllable_dic_en.inserted(word).split('-')

    def _find_simple_english_word(self, syllable):
        # ... (this logic remains the same)
        pre_selected = {'tion': 'nation', 'pro': 'promote'}
        if syllable.lower() in pre_selected: return pre_selected[syllable.lower()]
        try:
            syllable_phonemes = self.g2p_en(syllable)
            syllable_phonemes_base = [p.strip('012') for p in syllable_phonemes]
            for word, phonemes in self.cmu_dict_en:
                if len(self._get_english_syllables(word)) == 1 and word.isalpha():
                    phonemes_base = [p.strip('012') for p in phonemes]
                    if phonemes_base == syllable_phonemes_base: return word
        except Exception: return None
        return syllable

    def generate_audio(self, text, filepath, lang='en'):
        try:
            tts = gTTS(text=text, lang=lang, slow=False)
            tts.save(filepath)
        except Exception as e:
            print(f"Error generating audio for '{text}' with lang '{lang}': {e}")

    def breakdown_word(self, word):
        word = word.lower().strip()
        output_dir = "audio_output"
        os.makedirs(output_dir, exist_ok=True)
        
        lang_name = self._detect_language(word)
        lang_code_map = {'english': 'en', 'hindi': 'hi', 'telugu': 'te'}
        lang_code = lang_code_map.get(lang_name, 'en')
        
        safe_filename = "".join(c for c in word if c.isalnum() or c in (' ', '_')).rstrip()
        full_audio_path = os.path.join(output_dir, f"{safe_filename}.mp3")
        self.generate_audio(word, full_audio_path, lang=lang_code)

        result = {"word": word, "language": lang_name, "full_audio_path": full_audio_path, "syllables": []}

        if lang_name == 'english': components = self._get_english_syllables(word)
        elif lang_name == 'hindi': components = self._get_hindi_aksharas(word)
        elif lang_name == 'telugu': components = self._get_telugu_aksharas(word)
        else: components = [word]

        for i, comp in enumerate(components):
            comp_audio_path = os.path.join(output_dir, f"{lang_code}_{safe_filename}_{i}.mp3")
            self.generate_audio(comp, comp_audio_path, lang=lang_code)
            example_word = self._find_simple_english_word(comp) if lang_name == 'english' else "N/A"
            result["syllables"].append({"text": comp, "audio_path": comp_audio_path, "example_word_sound": example_word})
            
        return result
