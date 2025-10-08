import React, { useState, useEffect, useRef } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ScrollView,
  StyleSheet,
  ActivityIndicator,
  Alert,
  Animated,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { essayService } from '../services/api';

export default function EssayCorrectorScreen() {
  const [essay, setEssay] = useState('');
  const [language, setLanguage] = useState('en');
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  
  // Real-time checking states
  const [suggestions, setSuggestions] = useState([]);
  const [isChecking, setIsChecking] = useState(false);
  const [errors, setErrors] = useState([]);
  
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(30)).current;
  const typingTimer = useRef(null);

  useEffect(() => {
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 600,
        useNativeDriver: true,
      }),
      Animated.timing(slideAnim, {
        toValue: 0,
        duration: 600,
        useNativeDriver: true,
      }),
    ]).start();
  }, []);

  // Real-time checking with debounce
  useEffect(() => {
    // Clear previous timer
    if (typingTimer.current) {
      clearTimeout(typingTimer.current);
    }

    // Only check if there's text and user stopped typing for 1 second
    if (essay.trim().length > 10) {
      setIsChecking(true);
      typingTimer.current = setTimeout(() => {
        checkGrammarRealtime(essay);
      }, 1000); // Wait 1 second after user stops typing
    } else {
      setSuggestions([]);
      setErrors([]);
      setIsChecking(false);
    }

    return () => {
      if (typingTimer.current) {
        clearTimeout(typingTimer.current);
      }
    };
  }, [essay]);

  const checkGrammarRealtime = async (text) => {
    try {
      // Simple client-side checks
      const foundErrors = [];
      const foundSuggestions = [];

      // Check for common errors
      const lines = text.split('\n');
      lines.forEach((line, index) => {
        // Check for double spaces
        if (line.includes('  ')) {
          foundErrors.push({
            line: index + 1,
            type: 'spacing',
            message: 'Double space detected',
          });
        }

        // Check for missing capitalization at start
        if (line.length > 0 && line[0] === line[0].toLowerCase() && /[a-z]/.test(line[0])) {
          foundErrors.push({
            line: index + 1,
            type: 'capitalization',
            message: 'Sentence should start with capital letter',
          });
        }

        // Check for missing period at end
        if (line.length > 20 && !line.match(/[.!?]$/)) {
          foundSuggestions.push({
            line: index + 1,
            type: 'punctuation',
            message: 'Consider adding punctuation at the end',
          });
        }
      });

      // Check word count
      const wordCount = text.trim().split(/\s+/).length;
      if (wordCount < 50) {
        foundSuggestions.push({
          type: 'length',
          message: `Essay is short (${wordCount} words). Consider adding more content.`,
        });
      }

      setErrors(foundErrors);
      setSuggestions(foundSuggestions);
      setIsChecking(false);
    } catch (error) {
      console.error('Error checking grammar:', error);
      setIsChecking(false);
    }
  };

  const handleSubmit = async () => {
    if (!essay.trim()) {
      Alert.alert('Error', 'Please enter an essay to evaluate');
      return;
    }

    setLoading(true);
    setResult(null);

    const response = await essayService.evaluateEssay(essay, language);

    setLoading(false);

    if (response.success) {
      setResult(response.data);
    } else {
      Alert.alert('Error', response.error || 'Failed to evaluate essay. Make sure backend is running.');
    }
  };

  const applySuggestion = (suggestion) => {
    // Auto-fix suggestions
    if (suggestion.type === 'spacing') {
      setEssay(essay.replace(/  +/g, ' '));
      Alert.alert('Fixed', 'Double spaces removed');
    }
  };

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <LinearGradient
        colors={['#FF6B6B', '#FF8E53', '#FFA07A']}
        style={styles.gradient}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
      />
      
      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <Animated.View
          style={[
            styles.content,
            {
              opacity: fadeAnim,
              transform: [{ translateY: slideAnim }],
            },
          ]}
        >
          <View style={styles.header}>
            <View style={styles.iconContainer}>
              <Text style={styles.icon}>📝</Text>
            </View>
            <Text style={styles.title}>Essay Corrector</Text>
            <Text style={styles.subtitle}>
              Get AI-powered feedback with real-time suggestions
            </Text>
          </View>

          <View style={styles.card}>
            <Text style={styles.sectionLabel}>Select Language</Text>
            <View style={styles.languageSelector}>
              <TouchableOpacity
                style={[
                  styles.langButton,
                  language === 'en' && styles.langButtonActive,
                ]}
                onPress={() => setLanguage('en')}
                activeOpacity={0.8}
              >
                <Text
                  style={[
                    styles.langText,
                    language === 'en' && styles.langTextActive,
                  ]}
                >
                  🇬🇧 English
                </Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[
                  styles.langButton,
                  language === 'es' && styles.langButtonActive,
                ]}
                onPress={() => setLanguage('es')}
                activeOpacity={0.8}
              >
                <Text
                  style={[
                    styles.langText,
                    language === 'es' && styles.langTextActive,
                  ]}
                >
                  🇪🇸 Spanish
                </Text>
              </TouchableOpacity>
            </View>

            {/* Real-time Status */}
            <View style={styles.statusBar}>
              <View style={styles.statusItem}>
                <Text style={styles.statusLabel}>Words:</Text>
                <Text style={styles.statusValue}>
                  {essay.trim() ? essay.trim().split(/\s+/).length : 0}
                </Text>
              </View>
              <View style={styles.statusItem}>
                <Text style={styles.statusLabel}>Characters:</Text>
                <Text style={styles.statusValue}>{essay.length}</Text>
              </View>
              {isChecking && (
                <View style={styles.statusItem}>
                  <ActivityIndicator size="small" color="#667eea" />
                  <Text style={styles.statusLabel}>Checking...</Text>
                </View>
              )}
            </View>

            {/* Real-time Errors */}
            {errors.length > 0 && (
              <View style={styles.alertBox}>
                <Text style={styles.alertTitle}>⚠️ Issues Found:</Text>
                {errors.map((error, index) => (
                  <View key={index} style={styles.errorItem}>
                    <Text style={styles.errorText}>
                      Line {error.line}: {error.message}
                    </Text>
                  </View>
                ))}
              </View>
            )}

            {/* Real-time Suggestions */}
            {suggestions.length > 0 && (
              <View style={styles.suggestionBox}>
                <Text style={styles.suggestionTitle}>💡 Suggestions:</Text>
                {suggestions.map((suggestion, index) => (
                  <TouchableOpacity
                    key={index}
                    style={styles.suggestionItem}
                    onPress={() => applySuggestion(suggestion)}
                  >
                    <Text style={styles.suggestionText}>
                      {suggestion.line ? `Line ${suggestion.line}: ` : ''}
                      {suggestion.message}
                    </Text>
                    {suggestion.type === 'spacing' && (
                      <Text style={styles.fixButton}>Fix</Text>
                    )}
                  </TouchableOpacity>
                ))}
              </View>
            )}

            <Text style={styles.sectionLabel}>Your Essay</Text>
            <TextInput
              style={styles.textArea}
              placeholder="Start writing your essay here..."
              placeholderTextColor="#999"
              multiline
              numberOfLines={10}
              value={essay}
              onChangeText={setEssay}
              textAlignVertical="top"
            />

            <TouchableOpacity
              style={[styles.button, loading && styles.buttonDisabled]}
              onPress={handleSubmit}
              disabled={loading}
              activeOpacity={0.8}
            >
              <LinearGradient
                colors={loading ? ['#ccc', '#999'] : ['#667eea', '#764ba2']}
                style={styles.buttonGradient}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 0 }}
              >
                {loading ? (
                  <ActivityIndicator color="#fff" />
                ) : (
                  <Text style={styles.buttonText}>✨ Get Full Evaluation</Text>
                )}
              </LinearGradient>
            </TouchableOpacity>
          </View>

          {result && (
            <Animated.View
              style={[
                styles.resultCard,
                {
                  opacity: fadeAnim,
                },
              ]}
            >
              <View style={styles.resultHeader}>
                <Text style={styles.resultIcon}>✅</Text>
                <Text style={styles.resultTitle}>Evaluation Results</Text>
              </View>
              <View style={styles.resultContent}>
                <Text style={styles.resultText}>
                  {JSON.stringify(result.data, null, 2)}
                </Text>
              </View>
            </Animated.View>
          )}
        </Animated.View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FF6B6B',
  },
  gradient: {
    position: 'absolute',
    left: 0,
    right: 0,
    top: 0,
    bottom: 0,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingBottom: 40,
  },
  content: {
    padding: 20,
  },
  header: {
    alignItems: 'center',
    marginBottom: 30,
    marginTop: 20,
  },
  iconContainer: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: 'rgba(255, 255, 255, 0.3)',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 15,
  },
  icon: {
    fontSize: 40,
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    color: 'rgba(255, 255, 255, 0.9)',
    textAlign: 'center',
  },
  card: {
    backgroundColor: '#fff',
    borderRadius: 20,
    padding: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 5,
  },
  sectionLabel: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
    marginBottom: 12,
  },
  languageSelector: {
    flexDirection: 'row',
    marginBottom: 20,
    gap: 10,
  },
  langButton: {
    flex: 1,
    padding: 14,
    borderRadius: 12,
    backgroundColor: '#f5f5f5',
    borderWidth: 2,
    borderColor: '#e0e0e0',
    alignItems: 'center',
  },
  langButtonActive: {
    backgroundColor: '#667eea',
    borderColor: '#667eea',
  },
  langText: {
    color: '#333',
    fontWeight: '600',
    fontSize: 15,
  },
  langTextActive: {
    color: '#fff',
  },
  statusBar: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    backgroundColor: '#f9f9f9',
    padding: 12,
    borderRadius: 10,
    marginBottom: 15,
  },
  statusItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
  },
  statusLabel: {
    fontSize: 12,
    color: '#666',
    fontWeight: '600',
  },
  statusValue: {
    fontSize: 14,
    color: '#667eea',
    fontWeight: 'bold',
  },
  alertBox: {
    backgroundColor: '#fff3cd',
    borderLeftWidth: 4,
    borderLeftColor: '#ffc107',
    padding: 12,
    borderRadius: 8,
    marginBottom: 15,
  },
  alertTitle: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#856404',
    marginBottom: 8,
  },
  errorItem: {
    marginBottom: 5,
  },
  errorText: {
    fontSize: 13,
    color: '#856404',
  },
  suggestionBox: {
    backgroundColor: '#d1ecf1',
    borderLeftWidth: 4,
    borderLeftColor: '#17a2b8',
    padding: 12,
    borderRadius: 8,
    marginBottom: 15,
  },
  suggestionTitle: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#0c5460',
    marginBottom: 8,
  },
  suggestionItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 5,
  },
  suggestionText: {
    fontSize: 13,
    color: '#0c5460',
    flex: 1,
  },
  fixButton: {
    fontSize: 12,
    color: '#17a2b8',
    fontWeight: 'bold',
    paddingHorizontal: 10,
    paddingVertical: 4,
    backgroundColor: '#fff',
    borderRadius: 4,
  },
  textArea: {
    backgroundColor: '#f9f9f9',
    borderRadius: 12,
    padding: 15,
    fontSize: 16,
    minHeight: 200,
    borderWidth: 1,
    borderColor: '#e0e0e0',
    marginBottom: 20,
    color: '#333',
  },
  button: {
    borderRadius: 12,
    overflow: 'hidden',
    shadowColor: '#667eea',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 5,
  },
  buttonDisabled: {
    opacity: 0.6,
  },
  buttonGradient: {
    padding: 16,
    alignItems: 'center',
  },
  buttonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
  resultCard: {
    backgroundColor: '#fff',
    borderRadius: 20,
    padding: 20,
    marginTop: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 5,
  },
  resultHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 15,
  },
  resultIcon: {
    fontSize: 28,
    marginRight: 10,
  },
  resultTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#333',
  },
  resultContent: {
    backgroundColor: '#f9f9f9',
    borderRadius: 12,
    padding: 15,
  },
  resultText: {
    fontSize: 14,
    color: '#333',
    lineHeight: 20,
  },
});
