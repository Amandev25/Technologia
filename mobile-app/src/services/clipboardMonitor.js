import * as Clipboard from 'expo-clipboard';
import * as Notifications from 'expo-notifications';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { API_BASE_URL } from '../config/api';

let monitorInterval = null;
let lastClipboardText = '';

// Configure notifications
Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: true,
    shouldSetBadge: false,
  }),
});

export const clipboardMonitorService = {
  async startMonitoring() {
    console.log('Starting clipboard monitor...');
    
    // Request notification permissions
    const { status } = await Notifications.requestPermissionsAsync();
    if (status !== 'granted') {
      console.warn('Notification permission not granted');
      return false;
    }

    // Get initial clipboard content
    const initialText = await Clipboard.getStringAsync();
    lastClipboardText = initialText;

    // Start monitoring every 2 seconds
    monitorInterval = setInterval(async () => {
      await this.checkClipboard();
    }, 2000);

    await AsyncStorage.setItem('clipboardMonitorActive', 'true');
    console.log('Clipboard monitor started');
    return true;
  },

  async stopMonitoring() {
    if (monitorInterval) {
      clearInterval(monitorInterval);
      monitorInterval = null;
    }
    await AsyncStorage.setItem('clipboardMonitorActive', 'false');
    console.log('Clipboard monitor stopped');
  },

  async checkClipboard() {
    try {
      const currentText = await Clipboard.getStringAsync();
      
      // Check if clipboard changed and has meaningful content
      if (currentText && 
          currentText !== lastClipboardText && 
          currentText.length > 20 && 
          currentText.length < 5000) {
        
        console.log('New clipboard text detected:', currentText.substring(0, 50) + '...');
        lastClipboardText = currentText;
        
        // Analyze the text
        await this.analyzeText(currentText);
      }
    } catch (error) {
      console.error('Error checking clipboard:', error);
    }
  },

  async analyzeText(text) {
    try {
      console.log('Analyzing text with Gemini AI...');
      
      // Call Gemini-powered grammar check API
      const response = await fetch(`${API_BASE_URL}/grammar/check`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ text }),
      });

      const result = await response.json();
      console.log('Gemini response:', result);
      
      if (result.message === 'success' && result.data) {
        const { hasErrors, corrections, correctedText } = result.data;
        
        if (hasErrors && corrections && corrections.length > 0) {
          await this.showNotification(corrections, text, correctedText);
        } else {
          console.log('No corrections needed - text is perfect!');
        }
      }
    } catch (error) {
      console.error('Error analyzing text:', error);
    }
  },

  async showNotification(corrections, originalText, correctedText) {
    try {
      const correctionCount = corrections.length;
      
      // Create summary of corrections
      const summary = corrections.slice(0, 2).map(c => 
        `${c.original} → ${c.correction}`
      ).join(', ');
      
      await Notifications.scheduleNotificationAsync({
        content: {
          title: '✍️ Writing Suggestions',
          body: `Found ${correctionCount} issue${correctionCount > 1 ? 's' : ''}: ${summary}${correctionCount > 2 ? '...' : ''}`,
          data: { 
            corrections, 
            originalText,
            correctedText,
            type: 'grammar_check'
          },
          sound: true,
        },
        trigger: null, // Show immediately
      });
      
      console.log('Notification sent with corrections');
    } catch (error) {
      console.error('Error showing notification:', error);
    }
  },

  async isMonitoring() {
    const status = await AsyncStorage.getItem('clipboardMonitorActive');
    return status === 'true';
  },
};
