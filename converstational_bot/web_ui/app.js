// Global Variables
let currentScenario = null;
let conversationHistory = [];
let turnCount = 0;
let maxTurns = 6;
let isListening = false;
let recognition = null;
let synthesis = window.speechSynthesis;

// API Configuration - Update these with your actual backend URL
const API_URL = 'http://localhost:5000/api';  // Your Flask backend URL

// Initialize on page load
document.addEventListener('DOMContentLoaded', function() {
    initializeSpeechRecognition();
    console.log('Conversational Bot initialized');
});

// Speech Recognition Setup
function initializeSpeechRecognition() {
    if ('webkitSpeechRecognition' in window || 'SpeechRecognition' in window) {
        const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
        recognition = new SpeechRecognition();
        
        recognition.continuous = false;
        recognition.interimResults = false;
        recognition.lang = 'en-US';
        
        recognition.onstart = function() {
            console.log('Speech recognition started');
            document.getElementById('voice-status').textContent = '🎤 Listening...';
            document.getElementById('voice-btn').classList.add('active');
        };
        
        recognition.onresult = function(event) {
            const transcript = event.results[0][0].transcript;
            console.log('Recognized:', transcript);
            document.getElementById('text-input').value = transcript;
            sendMessage(transcript);
        };
        
        recognition.onerror = function(event) {
            console.error('Speech recognition error:', event.error);
            document.getElementById('voice-status').textContent = `Error: ${event.error}`;
            stopVoiceInput();
        };
        
        recognition.onend = function() {
            console.log('Speech recognition ended');
            stopVoiceInput();
        };
    } else {
        console.warn('Speech recognition not supported in this browser');
        document.getElementById('voice-btn').style.display = 'none';
    }
}

// Scenario Selection
function selectScenario(scenario) {
    currentScenario = scenario;
    conversationHistory = [];
    turnCount = 0;
    
    // Update UI
    const scenarioNames = {
        'defective_item': 'Returning a Defective Item (Polite)',
        'coffee_shop': 'Coffee Shop Conversation (Casual)',
        'manager_developer': 'Manager-Developer Meeting (Formal)'
    };
    
    document.getElementById('current-scenario-name').textContent = scenarioNames[scenario];
    updateTurnCounter();
    
    // Switch to conversation screen
    switchScreen('conversation-screen');
    
    // Start conversation with backend
    startConversation(scenario);
}

// Start Conversation
async function startConversation(scenario) {
    showLoading(true);
    
    try {
        const response = await fetch(`${API_URL}/start_conversation`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ scenario: scenario })
        });
        
        if (!response.ok) {
            throw new Error('Failed to start conversation');
        }
        
        const data = await response.json();
        const greeting = data.greeting || getDefaultGreeting(scenario);
        
        // Add bot message
        addMessage('bot', greeting);
        
        // Speak the greeting
        if (document.getElementById('auto-speak').checked) {
            speakText(greeting);
        }
        
    } catch (error) {
        console.error('Error starting conversation:', error);
        // Fallback to default greeting if backend is not available
        const greeting = getDefaultGreeting(scenario);
        addMessage('bot', greeting);
        if (document.getElementById('auto-speak').checked) {
            speakText(greeting);
        }
    } finally {
        showLoading(false);
    }
}

// Default greetings (fallback if backend is unavailable)
function getDefaultGreeting(scenario) {
    const greetings = {
        'defective_item': "Hello! I understand you'd like to return an item. I'm here to help you with that process. Could you please tell me what item you'd like to return and what seems to be the issue with it?",
        'coffee_shop': "Good morning! Welcome to our coffee shop. What can I get started for you today? We have some amazing seasonal drinks and fresh pastries!",
        'manager_developer': "Good morning. Thank you for meeting with me today. I'd like to discuss the current status of the project and any challenges you might be facing. Could you please provide an update on your progress?"
    };
    return greetings[scenario] || "Hello! How can I help you today?";
}

// Voice Input Toggle
function toggleVoiceInput() {
    if (!recognition) {
        alert('Speech recognition is not supported in your browser. Please use Chrome, Edge, or Safari.');
        return;
    }
    
    if (!isListening) {
        startVoiceInput();
    } else {
        stopVoiceInput();
    }
}

function startVoiceInput() {
    if (recognition && !isListening) {
        isListening = true;
        recognition.start();
    }
}

function stopVoiceInput() {
    if (recognition && isListening) {
        isListening = false;
        recognition.stop();
        document.getElementById('voice-status').textContent = '';
        document.getElementById('voice-btn').classList.remove('active');
    }
}

// Text Input
function handleKeyPress(event) {
    if (event.key === 'Enter') {
        sendTextMessage();
    }
}

function sendTextMessage() {
    const input = document.getElementById('text-input');
    const text = input.value.trim();
    
    if (text) {
        sendMessage(text);
        input.value = '';
    }
}

// Send Message
async function sendMessage(userMessage) {
    // Add user message to UI
    addMessage('user', userMessage);
    
    // Update turn counter
    turnCount++;
    updateTurnCounter();
    
    // Check if conversation should end
    if (turnCount >= maxTurns || checkEndPhrases(userMessage)) {
        setTimeout(() => {
            endConversation();
        }, 1000);
        return;
    }
    
    // Get bot response
    showLoading(true);
    
    try {
        const response = await fetch(`${API_URL}/generate_response`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                scenario: currentScenario,
                user_message: userMessage,
                conversation_history: conversationHistory
            })
        });
        
        if (!response.ok) {
            throw new Error('Failed to get response');
        }
        
        const data = await response.json();
        const botResponse = data.response || "I understand. Could you tell me more?";
        
        // Add bot message
        addMessage('bot', botResponse);
        
        // Speak the response
        if (document.getElementById('auto-speak').checked) {
            speakText(botResponse);
        }
        
    } catch (error) {
        console.error('Error getting response:', error);
        // Fallback response
        const botResponse = getFallbackResponse(currentScenario, userMessage);
        addMessage('bot', botResponse);
        if (document.getElementById('auto-speak').checked) {
            speakText(botResponse);
        }
    } finally {
        showLoading(false);
    }
}

// Fallback responses (if backend is unavailable)
function getFallbackResponse(scenario, userMessage) {
    const responses = {
        'defective_item': "I understand your concern. Let me help you with that return process. Could you please provide your order number?",
        'coffee_shop': "That sounds great! I'll get that started for you right away. Would you like anything else?",
        'manager_developer': "Thank you for the update. Could you provide more details about the current challenges?"
    };
    return responses[scenario] || "I see. Could you tell me more about that?";
}

// Check for end phrases
function checkEndPhrases(text) {
    const endPhrases = ['goodbye', 'bye', 'thank you', 'that\'s all', 'done', 'finished', 'end'];
    const lowerText = text.toLowerCase();
    return endPhrases.some(phrase => lowerText.includes(phrase));
}

// Add Message to UI
function addMessage(sender, text) {
    const chatContainer = document.getElementById('chat-container');
    const messageDiv = document.createElement('div');
    messageDiv.className = `chat-message ${sender}`;
    
    const now = new Date();
    const timeString = now.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' });
    
    messageDiv.innerHTML = `
        <div class="message-content">
            <div class="message-header">
                <i class="fas fa-${sender === 'bot' ? 'robot' : 'user'}"></i>
                <span>${sender === 'bot' ? 'AI Assistant' : 'You'}</span>
            </div>
            <div class="message-text">${text}</div>
            <div class="message-time">${timeString}</div>
            ${sender === 'bot' ? `
                <div class="message-actions">
                    <button onclick="speakText('${text.replace(/'/g, "\\'")}')" title="Play audio">
                        <i class="fas fa-volume-up"></i>
                    </button>
                    <button onclick="copyText('${text.replace(/'/g, "\\'")}')" title="Copy text">
                        <i class="fas fa-copy"></i>
                    </button>
                </div>
            ` : ''}
        </div>
    `;
    
    chatContainer.appendChild(messageDiv);
    chatContainer.scrollTop = chatContainer.scrollHeight;
    
    // Add to conversation history
    conversationHistory.push({
        speaker: sender,
        message: text,
        timestamp: now.toISOString()
    });
}

// Text to Speech
function speakText(text) {
    if (!synthesis) {
        console.error('Speech synthesis not supported');
        return;
    }
    
    // Cancel any ongoing speech
    synthesis.cancel();
    
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.rate = 0.9;
    utterance.pitch = 1;
    utterance.volume = 1;
    
    // Get English voice if available
    const voices = synthesis.getVoices();
    const englishVoice = voices.find(voice => voice.lang.startsWith('en'));
    if (englishVoice) {
        utterance.voice = englishVoice;
    }
    
    synthesis.speak(utterance);
}

// Copy Text
function copyText(text) {
    navigator.clipboard.writeText(text).then(() => {
        alert('Text copied to clipboard!');
    });
}

// Update Turn Counter
function updateTurnCounter() {
    document.getElementById('turn-counter').textContent = `Turn: ${turnCount}/${maxTurns}`;
}

// End Conversation
async function endConversation() {
    showLoading(true);
    
    try {
        // Generate report
        const response = await fetch(`${API_URL}/generate_report`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                scenario: currentScenario,
                conversation_history: conversationHistory
            })
        });
        
        if (response.ok) {
            const report = await response.json();
            displayReport(report);
        } else {
            throw new Error('Failed to generate report');
        }
    } catch (error) {
        console.error('Error generating report:', error);
        // Generate fallback report
        const fallbackReport = generateFallbackReport();
        displayReport(fallbackReport);
    } finally {
        showLoading(false);
        switchScreen('report-screen');
    }
}

// Generate Fallback Report
function generateFallbackReport() {
    const userMessages = conversationHistory.filter(msg => msg.speaker === 'user');
    const totalWords = userMessages.reduce((sum, msg) => sum + msg.message.split(' ').length, 0);
    const avgWords = userMessages.length > 0 ? Math.round(totalWords / userMessages.length) : 0;
    
    return {
        overall_score: 75,
        grammar: {
            score: 80,
            details: 'Good grammar usage with minor improvements needed.'
        },
        pronunciation: {
            score: 75,
            details: 'Pronunciation is generally clear.'
        },
        professional: {
            score: 70,
            details: 'Use more professional language in formal contexts.'
        },
        fluency: {
            score: 75,
            details: `Average ${avgWords} words per message. Good conversational flow.`
        },
        recommendations: [
            'Practice using more formal language structures',
            'Work on pronunciation of difficult words',
            'Expand your vocabulary for professional settings',
            'Maintain consistent tone throughout the conversation'
        ]
    };
}

// Display Report
function displayReport(report) {
    // Overall Score
    document.getElementById('overall-score').querySelector('.score-value').textContent = report.overall_score || 0;
    
    // Individual Scores
    document.getElementById('grammar-score').textContent = `${report.grammar?.score || 0}/100`;
    document.getElementById('grammar-details').textContent = report.grammar?.details || '';
    
    document.getElementById('pronunciation-score').textContent = `${report.pronunciation?.score || 0}/100`;
    document.getElementById('pronunciation-details').textContent = report.pronunciation?.details || '';
    
    document.getElementById('professional-score').textContent = `${report.professional?.score || 0}/100`;
    document.getElementById('professional-details').textContent = report.professional?.details || '';
    
    document.getElementById('fluency-score').textContent = `${report.fluency?.score || 0}/100`;
    document.getElementById('fluency-details').textContent = report.fluency?.details || '';
    
    // Recommendations
    const recommendationsList = document.getElementById('recommendations-list');
    recommendationsList.innerHTML = '';
    
    if (report.recommendations && report.recommendations.length > 0) {
        report.recommendations.forEach(rec => {
            const div = document.createElement('div');
            div.className = 'recommendation-item';
            div.innerHTML = `<i class="fas fa-lightbulb"></i> ${rec}`;
            recommendationsList.appendChild(div);
        });
    }
    
    // Conversation Transcript
    const transcript = document.getElementById('conversation-transcript');
    transcript.innerHTML = '';
    
    conversationHistory.forEach(msg => {
        const div = document.createElement('div');
        div.className = 'transcript-item';
        div.innerHTML = `
            <div class="transcript-speaker">${msg.speaker === 'bot' ? 'AI Assistant' : 'You'}</div>
            <div class="transcript-text">${msg.message}</div>
        `;
        transcript.appendChild(div);
    });
}

// Download Report
function downloadReport(format) {
    const report = {
        scenario: currentScenario,
        conversation_history: conversationHistory,
        timestamp: new Date().toISOString()
    };
    
    if (format === 'json') {
        const blob = new Blob([JSON.stringify(report, null, 2)], { type: 'application/json' });
        downloadFile(blob, `conversation_report_${Date.now()}.json`);
    } else if (format === 'txt') {
        let text = `Conversation Report\n`;
        text += `Scenario: ${currentScenario}\n`;
        text += `Date: ${new Date().toLocaleString()}\n\n`;
        text += `Conversation:\n`;
        text += `${'-'.repeat(50)}\n`;
        
        conversationHistory.forEach(msg => {
            text += `\n[${msg.speaker.toUpperCase()}]: ${msg.message}\n`;
        });
        
        const blob = new Blob([text], { type: 'text/plain' });
        downloadFile(blob, `conversation_summary_${Date.now()}.txt`);
    } else if (format === 'pdf') {
        alert('PDF export feature coming soon!');
    }
}

function downloadFile(blob, filename) {
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
}

// Utility Functions
function switchScreen(screenId) {
    document.querySelectorAll('.screen').forEach(screen => {
        screen.classList.remove('active');
    });
    document.getElementById(screenId).classList.add('active');
}

function showLoading(show) {
    const overlay = document.getElementById('loading-overlay');
    if (show) {
        overlay.classList.add('active');
    } else {
        overlay.classList.remove('active');
    }
}

function resetApp() {
    currentScenario = null;
    conversationHistory = [];
    turnCount = 0;
    document.getElementById('chat-container').innerHTML = '';
    switchScreen('scenario-screen');
}

// Load voices for TTS when available
if (synthesis) {
    synthesis.onvoiceschanged = function() {
        const voices = synthesis.getVoices();
        console.log('Available voices:', voices.length);
    };
}
