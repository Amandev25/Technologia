# Visual Guide - Enhanced LLM Reports in Web UI

## Report Screen Layout

```
┌─────────────────────────────────────────────────────────────┐
│  📊 Conversation Report - Coffee Shop Conversation          │
│  [← Back to Practice]                                       │
└─────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────┐
│  Overall Performance                                         │
│                                                              │
│                    85/100                                    │
│                                                              │
│  Great job! You demonstrated good communication skills.     │
└─────────────────────────────────────────────────────────────┘

┌──────────────┬──────────────┬──────────────┬──────────────┐
│   Grammar    │ Pronunciation│ Professional │   Fluency    │
│    82/100    │    88/100    │    90/100    │    85/100    │
│              │              │              │              │
│ Total errors:│ Pronunciation│ Casual lang: │ Avg words:   │
│ 3. Error     │ errors: 2.   │ 1 issue.     │ 12.5 per     │
│ rate: 0.50   │ Difficult    │ Politeness:  │ message.     │
│              │ sounds: th,r │ 0 issues     │ Variety: 0.8 │
└──────────────┴──────────────┴──────────────┴──────────────┘

┌─────────────────────────────────────────────────────────────┐
│  🧠 AI-Powered Insights                                      │
├─────────────────────────────────────────────────────────────┤
│  💡 You demonstrated good conversational flow and natural   │
│     turn-taking in this casual setting.                     │
│                                                              │
│  💡 Your use of polite phrases like "please" and "thank you"│
│     shows good manners even in casual contexts.             │
│                                                              │
│  💡 Consider using more varied vocabulary to express your   │
│     preferences instead of repeating "I want".              │
└─────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────┐
│  ⚠️ Detailed Error Analysis                                  │
├─────────────────────────────────────────────────────────────┤
│  [Grammar & Spelling] [Pronunciation]                       │
├─────────────────────────────────────────────────────────────┤
│                                                              │
│  ┌───────────────────────────────────────────────────────┐ │
│  │ SUBJECT-VERB AGREEMENT              Message #2        │ │
│  ├───────────────────────────────────────────────────────┤ │
│  │ Original:  "I wants a large coffee"                   │ │
│  │ Correction: "I want a large coffee"                   │ │
│  │                                                        │ │
│  │ Explanation: Use "want" with "I", not "wants".       │ │
│  │ "Wants" is only used with he/she/it.                 │ │
│  └───────────────────────────────────────────────────────┘ │
│                                                              │
│  ┌───────────────────────────────────────────────────────┐ │
│  │ SPELLING ERROR                      Message #3        │ │
│  ├───────────────────────────────────────────────────────┤ │
│  │ Misspelled: "expresso"                                │ │
│  │ Correct:    "espresso"                                │ │
│  │                                                        │ │
│  │ Context: "Can I get an expresso shot?"                │ │
│  └───────────────────────────────────────────────────────┘ │
│                                                              │
└─────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────┐
│  💡 Improvement Suggestions                                  │
├─────────────────────────────────────────────────────────────┤
│  💡 Practice subject-verb agreement with different pronouns │
│                                                              │
│  💡 Review common coffee terminology spelling               │
│                                                              │
│  💡 Try using "I'd like" instead of "I want" for politeness│
└─────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────┐
│  📜 Conversation Transcript                                  │
├─────────────────────────────────────────────────────────────┤
│  AI Assistant:                                               │
│  Good morning! Welcome to our coffee shop. What can I get   │
│  for you today?                                              │
│                                                              │
│  You:                                                        │
│  Hi! I wants a large coffee please.                         │
│                                                              │
│  AI Assistant:                                               │
│  Sure! Would you like any particular type of coffee?        │
│                                                              │
│  You:                                                        │
│  Can I get an expresso shot in it?                          │
│                                                              │
│  ...                                                         │
└─────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────┐
│  📥 Download Reports                                         │
│  [Download JSON] [Download TXT] [Download PDF]              │
└─────────────────────────────────────────────────────────────┘
```

## Pronunciation Tab View

When clicking the "Pronunciation" tab:

```
┌─────────────────────────────────────────────────────────────┐
│  ⚠️ Detailed Error Analysis                                  │
├─────────────────────────────────────────────────────────────┤
│  [Grammar & Spelling] [Pronunciation] ← Active              │
├─────────────────────────────────────────────────────────────┤
│                                                              │
│  ┌───────────────────────────────────────────────────────┐ │
│  │ PRONUNCIATION                                          │ │
│  ├───────────────────────────────────────────────────────┤ │
│  │ Word: "espresso"                                       │ │
│  │ Phonetic: /eˈspresəʊ/                                 │ │
│  │                                                        │ │
│  │ Tip: Emphasize the "s" at the beginning, not "x".    │ │
│  │ It's es-PRESS-oh, not ex-PRESS-oh.                   │ │
│  └───────────────────────────────────────────────────────┘ │
│                                                              │
│  ┌───────────────────────────────────────────────────────┐ │
│  │ PRONUNCIATION                                          │ │
│  ├───────────────────────────────────────────────────────┤ │
│  │ Word: "latte"                                          │ │
│  │ Phonetic: /ˈlɑːteɪ/                                   │ │
│  │                                                        │ │
│  │ Tip: Pronounce as "LAH-tay", not "LAT-ee". The "a"   │ │
│  │ is long like in "father".                             │ │
│  └───────────────────────────────────────────────────────┘ │
│                                                              │
└─────────────────────────────────────────────────────────────┘
```

## No Errors State

When the user has no errors:

```
┌─────────────────────────────────────────────────────────────┐
│  ⚠️ Detailed Error Analysis                                  │
├─────────────────────────────────────────────────────────────┤
│  [Grammar & Spelling] [Pronunciation]                       │
├─────────────────────────────────────────────────────────────┤
│                                                              │
│                        ✅                                    │
│                                                              │
│         Great job! No grammar or spelling                   │
│              errors detected.                                │
│                                                              │
└─────────────────────────────────────────────────────────────┘
```

## Color Coding

### LLM Insights Section
- **Background**: Purple gradient (#667eea → #764ba2)
- **Text**: White
- **Accent**: Gold border (#ffd700)
- **Cards**: Semi-transparent white with blur effect

### Error Cards

#### Grammar Errors
- **Background**: Light red (#fff5f5)
- **Border**: Red (#e53e3e)
- **Badge**: Red with light background
- **Original text**: Red background
- **Corrected text**: Green background

#### Spelling Errors
- **Background**: Light yellow (#fff8e1)
- **Border**: Orange (#ff9800)
- **Badge**: Orange with light background
- **Original text**: Red background
- **Corrected text**: Green background

#### Pronunciation Tips
- **Background**: Light blue (#e3f2fd)
- **Border**: Blue (#2196f3)
- **Badge**: Blue with light background
- **Phonetic text**: Blue, monospace font

## Interactive Elements

### Tab Switching
```
Before click:
[Grammar & Spelling] [Pronunciation]
     ↑ active             ↑ inactive

After clicking Pronunciation:
[Grammar & Spelling] [Pronunciation]
     ↑ inactive           ↑ active
                          └─ Green underline
```

### Hover Effects
- **Error tabs**: Light green background on hover
- **Error cards**: Subtle shadow increase on hover
- **Buttons**: Scale up slightly on hover

## Responsive Design

### Desktop (> 768px)
- Full width cards
- Side-by-side score cards
- Comfortable spacing

### Tablet (768px - 480px)
- Stacked score cards
- Slightly reduced padding
- Full width error cards

### Mobile (< 480px)
- Single column layout
- Compact spacing
- Touch-friendly buttons
- Scrollable transcript

## Typography Hierarchy

```
┌─────────────────────────────────────────┐
│ Section Title (1.5rem, 700 weight)      │ ← Inter font
├─────────────────────────────────────────┤
│   Error Type Badge (0.75rem, 600)       │ ← Uppercase
│   Message Index (0.75rem, 500)          │ ← Gray
│                                          │
│   Original Text (0.875rem, mono)        │ ← Courier New
│   Corrected Text (0.875rem, mono)       │ ← Courier New
│                                          │
│   Explanation (0.875rem, italic)        │ ← Inter font
└─────────────────────────────────────────┘
```

## Animation Details

### Fade In (Error Panels)
```css
@keyframes fadeIn {
  from { opacity: 0; }
  to { opacity: 1; }
}
Duration: 0.3s
Easing: ease
```

### Tab Transition
- Border color: 0.3s ease
- Background color: 0.3s ease
- Text color: 0.3s ease

### Card Hover
- Shadow: 0.2s ease
- Transform: 0.2s ease

## Accessibility Features

- ✅ **Semantic HTML**: Proper heading hierarchy
- ✅ **ARIA labels**: Screen reader friendly
- ✅ **Keyboard navigation**: Tab through elements
- ✅ **Color contrast**: WCAG AA compliant
- ✅ **Focus indicators**: Visible focus states
- ✅ **Responsive text**: Scales with viewport

## Browser-Specific Notes

### Chrome/Edge
- Full support for all features
- Backdrop filter works perfectly
- Smooth animations

### Firefox
- Backdrop filter may not work (fallback: solid background)
- All other features work perfectly

### Safari
- Full support on macOS/iOS
- Backdrop filter works
- May need `-webkit-` prefixes (already included)

## Print Styles (Future)

When printing the report:
- Remove gradients (use solid colors)
- Increase contrast
- Remove interactive elements
- Page breaks between sections

---

**Visual Guide Version**: 1.0
**Last Updated**: October 7, 2025
