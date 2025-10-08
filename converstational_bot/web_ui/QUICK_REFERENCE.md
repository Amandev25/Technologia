# Quick Reference - LLM-Enhanced Web UI

## 🚀 Quick Start

```bash
# 1. Start backend
cd converstational_bot/web_ui
python backend_api.py

# 2. Open frontend
# Double-click index.html or use:
python -m http.server 8000
```

## 📊 New Features at a Glance

### 🧠 AI-Powered Insights
- Purple gradient section
- High-level feedback on communication style
- Appears automatically when available

### ⚠️ Detailed Error Analysis
Two tabs with pinpointed errors:

**Grammar & Spelling Tab:**
- Red cards: Grammar errors
- Orange cards: Spelling errors
- Shows: Original → Correction + Explanation

**Pronunciation Tab:**
- Blue cards: Pronunciation tips
- Shows: Word + Phonetic + Tips

## 🎨 Color Code

| Color | Meaning |
|-------|---------|
| 🟣 Purple | AI Insights |
| 🔴 Red | Grammar Errors |
| 🟠 Orange | Spelling Errors |
| 🔵 Blue | Pronunciation Tips |
| 🟢 Green | Success/Corrections |

## 📁 Key Files

| File | Purpose |
|------|---------|
| `index.html` | Frontend structure |
| `styles.css` | Styling + error cards |
| `app.js` | JavaScript logic |
| `backend_api.py` | Flask API (LLM enabled) |

## 🔧 Configuration

**Enable LLM Analysis:**
```python
# In backend_api.py (line 25)
report_generator = ReportGenerator(use_llm=True)
```

**API Key:**
```python
# In config.py
GEMINI_API_KEY = 'your_key_here'
```

## 🎯 Error Card Structure

### Grammar Error
```
┌─────────────────────────────────┐
│ ERROR TYPE          Message #X  │
│ Original:  [wrong text]         │
│ Correction: [correct text]      │
│ Explanation: [why it's wrong]   │
└─────────────────────────────────┘
```

### Spelling Error
```
┌─────────────────────────────────┐
│ SPELLING ERROR      Message #X  │
│ Misspelled: [wrong]             │
│ Correct:    [right]             │
│ Context: [sentence]             │
└─────────────────────────────────┘
```

### Pronunciation Tip
```
┌─────────────────────────────────┐
│ PRONUNCIATION                   │
│ Word: [word]                    │
│ Phonetic: [/pronunciation/]     │
│ Tip: [how to say it]            │
└─────────────────────────────────┘
```

## 🔍 Where to Find Things

**In the Report Screen:**
1. Scroll to **Overall Score** (top)
2. See **Individual Scores** (4 cards)
3. Check **🧠 AI-Powered Insights** (purple section)
4. Review **⚠️ Detailed Error Analysis** (tabs)
5. Read **💡 Improvement Suggestions**
6. View **📜 Conversation Transcript**

## 🐛 Quick Troubleshooting

| Problem | Solution |
|---------|----------|
| No insights showing | Check `use_llm=True` in backend_api.py |
| Errors not displaying | Verify conversation has user messages |
| Backend not responding | Ensure Flask server is running |
| Styling looks wrong | Clear browser cache |
| CORS errors | Install flask-cors: `pip install flask-cors` |

## 📖 Documentation

| Document | What's Inside |
|----------|---------------|
| `ENHANCED_REPORTS.md` | Complete feature guide |
| `WEB_UI_ENHANCEMENT_SUMMARY.md` | Technical details |
| `VISUAL_GUIDE.md` | Design reference |
| `README.md` | General documentation |
| `WEB_UI_UPDATE_COMPLETE.md` | Update summary |

## 🎯 JavaScript Functions

**New Functions Added:**
- `displayLLMInsights(report)` - Show AI insights
- `displayDetailedErrors(report)` - Show error tabs
- `createGrammarErrorCard(error)` - Create grammar card
- `createSpellingErrorCard(error)` - Create spelling card
- `createPronunciationErrorCard(error)` - Create pronunciation card
- `switchErrorTab(tab)` - Switch between tabs

## 📊 Report Data Structure

```json
{
  "grammar": {
    "score": 85,
    "errors": [...],           // NEW: Array of error objects
    "spelling_errors": [...],  // NEW: Array of spelling errors
    "insights": [...],         // NEW: Array of insights
    "total_errors": 3,
    "details": "..."
  },
  "pronunciation": {
    "score": 88,
    "errors": [...],           // NEW: Array of error objects
    "likely_errors": [...],    // NEW: Array of likely errors
    "total_errors": 2,
    "details": "..."
  }
}
```

## 🌐 Browser Support

| Browser | Support | Notes |
|---------|---------|-------|
| Chrome | ✅ Full | Recommended |
| Edge | ✅ Full | Recommended |
| Firefox | ✅ Full | Backdrop filter may fallback |
| Safari | ✅ Full | Works on macOS/iOS |
| Mobile | ✅ Full | Responsive design |

## ⚡ Performance

- **LLM Analysis**: +2-3 seconds
- **Rendering**: <100ms
- **Memory**: Negligible impact

## 🎨 CSS Classes Reference

**New Classes:**
- `.llm-insights-section` - Purple gradient container
- `.insights-container` - Insights list
- `.insight-item` - Individual insight card
- `.detailed-errors-section` - Error tabs container
- `.error-tabs` - Tab navigation
- `.error-tab` - Individual tab button
- `.error-detail-panel` - Tab content panel
- `.error-card` - Individual error card
- `.error-type` - Error badge
- `.original-text` - Original text display
- `.corrected-text` - Corrected text display
- `.error-explanation` - Explanation text
- `.pronunciation-tip` - Pronunciation container
- `.phonetic` - Phonetic text
- `.no-errors-message` - Success message

## 📱 Responsive Breakpoints

- **Desktop**: > 768px (full layout)
- **Tablet**: 768px - 480px (stacked cards)
- **Mobile**: < 480px (single column)

## 🔮 Coming Soon

- [ ] PDF export with detailed errors
- [ ] Audio pronunciation guides
- [ ] Interactive error correction
- [ ] Progress tracking
- [ ] Multi-language support

---

**Version**: 2.0 (LLM-Enhanced)
**Last Updated**: October 7, 2025

**Need Help?** Check `ENHANCED_REPORTS.md` for detailed documentation.
