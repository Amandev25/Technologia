import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  ActivityIndicator,
  Alert,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { API_BASE_URL } from '../config/api';

export default function QuizScreen({ navigation }) {
  const [currentLevel, setCurrentLevel] = useState(1);
  const [questions, setQuestions] = useState([]);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState(null);
  const [userAnswers, setUserAnswers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [quizStarted, setQuizStarted] = useState(false);
  const [topic, setTopic] = useState('English Grammar');

  const topics = [
    'English Grammar',
    'General Knowledge',
    'Science',
    'Mathematics',
    'History',
    'Geography',
  ];

  const startQuiz = async () => {
    setLoading(true);
    try {
      const response = await fetch(`${API_BASE_URL}/quiz/generate`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ level: currentLevel, topic }),
      });

      const result = await response.json();
      
      if (result.message === 'success') {
        setQuestions(result.data.questions);
        setQuizStarted(true);
        setCurrentQuestion(0);
        setUserAnswers([]);
        setSelectedAnswer(null);
      } else {
        Alert.alert('Error', 'Failed to generate quiz');
      }
    } catch (error) {
      Alert.alert('Error', 'Failed to load quiz');
    } finally {
      setLoading(false);
    }
  };

  const handleAnswer = (answer) => {
    setSelectedAnswer(answer);
  };

  const nextQuestion = () => {
    const newAnswers = [...userAnswers, selectedAnswer];
    setUserAnswers(newAnswers);
    setSelectedAnswer(null);

    if (currentQuestion < questions.length - 1) {
      setCurrentQuestion(currentQuestion + 1);
    } else {
      submitQuiz(newAnswers);
    }
  };

  const submitQuiz = async (answers) => {
    setLoading(true);
    try {
      const response = await fetch(`${API_BASE_URL}/quiz/submit`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          level: currentLevel,
          answers,
          questions,
        }),
      });

      const result = await response.json();
      
      if (result.message === 'success') {
        navigation.navigate('QuizReport', { report: result.data });
        setQuizStarted(false);
      }
    } catch (error) {
      Alert.alert('Error', 'Failed to submit quiz');
    } finally {
      setLoading(false);
    }
  };

  const renderStartScreen = () => (
    <View style={styles.startScreen}>
      <Text style={styles.startIcon}>🎯</Text>
      <Text style={styles.startTitle}>Quiz Time!</Text>
      <Text style={styles.startSubtitle}>Test your knowledge</Text>

      <View style={styles.levelSelector}>
        <Text style={styles.sectionTitle}>Select Level</Text>
        <View style={styles.levelButtons}>
          {[1, 2, 3].map((level) => (
            <TouchableOpacity
              key={level}
              style={[
                styles.levelButton,
                currentLevel === level && styles.levelButtonActive,
              ]}
              onPress={() => setCurrentLevel(level)}
            >
              <Text
                style={[
                  styles.levelButtonText,
                  currentLevel === level && styles.levelButtonTextActive,
                ]}
              >
                Level {level}
              </Text>
              <Text style={styles.levelDifficulty}>
                {level === 1 ? 'Basic' : level === 2 ? 'Intermediate' : 'Advanced'}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
      </View>

      <View style={styles.topicSelector}>
        <Text style={styles.sectionTitle}>Select Topic</Text>
        <ScrollView horizontal showsHorizontalScrollIndicator={false}>
          {topics.map((t) => (
            <TouchableOpacity
              key={t}
              style={[
                styles.topicChip,
                topic === t && styles.topicChipActive,
              ]}
              onPress={() => setTopic(t)}
            >
              <Text
                style={[
                  styles.topicChipText,
                  topic === t && styles.topicChipTextActive,
                ]}
              >
                {t}
              </Text>
            </TouchableOpacity>
          ))}
        </ScrollView>
      </View>

      <View style={styles.infoCard}>
        <Text style={styles.infoTitle}>📋 Quiz Rules</Text>
        <Text style={styles.infoText}>
          • 5 questions per level{'\n'}
          • Pass with 3+ correct answers{'\n'}
          • Unlock next level on pass{'\n'}
          • Detailed report at the end
        </Text>
      </View>

      <TouchableOpacity
        style={styles.startButton}
        onPress={startQuiz}
        disabled={loading}
      >
        <LinearGradient
          colors={['#667eea', '#764ba2']}
          style={styles.startButtonGradient}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 0 }}
        >
          {loading ? (
            <ActivityIndicator color="#fff" />
          ) : (
            <Text style={styles.startButtonText}>🚀 Start Quiz</Text>
          )}
        </LinearGradient>
      </TouchableOpacity>
    </View>
  );

  const renderQuestion = () => {
    const question = questions[currentQuestion];
    if (!question) return null;

    return (
      <View style={styles.questionScreen}>
        <View style={styles.progressBar}>
          <View style={styles.progressInfo}>
            <Text style={styles.progressText}>
              Question {currentQuestion + 1} of {questions.length}
            </Text>
            <Text style={styles.levelBadge}>Level {currentLevel}</Text>
          </View>
          <View style={styles.progressTrack}>
            <View
              style={[
                styles.progressFill,
                { width: `${((currentQuestion + 1) / questions.length) * 100}%` },
              ]}
            />
          </View>
        </View>

        <View style={styles.questionCard}>
          <Text style={styles.questionText}>{question.question}</Text>
        </View>

        <View style={styles.optionsContainer}>
          {Object.entries(question.options).map(([key, value]) => (
            <TouchableOpacity
              key={key}
              style={[
                styles.optionButton,
                selectedAnswer === key && styles.optionButtonSelected,
              ]}
              onPress={() => handleAnswer(key)}
            >
              <View style={styles.optionContent}>
                <View
                  style={[
                    styles.optionCircle,
                    selectedAnswer === key && styles.optionCircleSelected,
                  ]}
                >
                  <Text
                    style={[
                      styles.optionLetter,
                      selectedAnswer === key && styles.optionLetterSelected,
                    ]}
                  >
                    {key}
                  </Text>
                </View>
                <Text
                  style={[
                    styles.optionText,
                    selectedAnswer === key && styles.optionTextSelected,
                  ]}
                >
                  {value}
                </Text>
              </View>
            </TouchableOpacity>
          ))}
        </View>

        <TouchableOpacity
          style={[styles.nextButton, !selectedAnswer && styles.nextButtonDisabled]}
          onPress={nextQuestion}
          disabled={!selectedAnswer || loading}
        >
          {loading ? (
            <ActivityIndicator color="#fff" />
          ) : (
            <Text style={styles.nextButtonText}>
              {currentQuestion < questions.length - 1 ? 'Next Question →' : 'Submit Quiz ✓'}
            </Text>
          )}
        </TouchableOpacity>
      </View>
    );
  };

  return (
    <View style={styles.container}>
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
        {!quizStarted ? renderStartScreen() : renderQuestion()}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
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
    padding: 20,
    paddingBottom: 40,
  },
  startScreen: {
    alignItems: 'center',
    paddingTop: 40,
  },
  startIcon: {
    fontSize: 80,
    marginBottom: 20,
  },
  startTitle: {
    fontSize: 36,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 10,
  },
  startSubtitle: {
    fontSize: 18,
    color: 'rgba(255, 255, 255, 0.9)',
    marginBottom: 40,
  },
  levelSelector: {
    width: '100%',
    marginBottom: 30,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 15,
  },
  levelButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  levelButton: {
    flex: 1,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    padding: 20,
    borderRadius: 15,
    marginHorizontal: 5,
    alignItems: 'center',
    borderWidth: 2,
    borderColor: 'transparent',
  },
  levelButtonActive: {
    backgroundColor: '#fff',
    borderColor: '#fff',
  },
  levelButtonText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 5,
  },
  levelButtonTextActive: {
    color: '#FF6B6B',
  },
  levelDifficulty: {
    fontSize: 12,
    color: 'rgba(255, 255, 255, 0.8)',
  },
  topicSelector: {
    width: '100%',
    marginBottom: 30,
  },
  topicChip: {
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderRadius: 20,
    marginRight: 10,
  },
  topicChipActive: {
    backgroundColor: '#fff',
  },
  topicChipText: {
    color: '#fff',
    fontWeight: '600',
  },
  topicChipTextActive: {
    color: '#FF6B6B',
  },
  infoCard: {
    backgroundColor: 'rgba(255, 255, 255, 0.95)',
    borderRadius: 15,
    padding: 20,
    width: '100%',
    marginBottom: 30,
  },
  infoTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 10,
  },
  infoText: {
    fontSize: 14,
    color: '#666',
    lineHeight: 22,
  },
  startButton: {
    width: '100%',
    borderRadius: 15,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 5,
  },
  startButtonGradient: {
    padding: 18,
    alignItems: 'center',
  },
  startButtonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
  questionScreen: {
    paddingTop: 20,
  },
  progressBar: {
    marginBottom: 30,
  },
  progressInfo: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 10,
  },
  progressText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  levelBadge: {
    backgroundColor: 'rgba(255, 255, 255, 0.3)',
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 12,
    color: '#fff',
    fontSize: 14,
    fontWeight: '600',
  },
  progressTrack: {
    height: 8,
    backgroundColor: 'rgba(255, 255, 255, 0.3)',
    borderRadius: 4,
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    backgroundColor: '#fff',
    borderRadius: 4,
  },
  questionCard: {
    backgroundColor: '#fff',
    borderRadius: 20,
    padding: 25,
    marginBottom: 25,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 5,
  },
  questionText: {
    fontSize: 20,
    fontWeight: '600',
    color: '#333',
    lineHeight: 28,
  },
  optionsContainer: {
    marginBottom: 25,
  },
  optionButton: {
    backgroundColor: '#fff',
    borderRadius: 15,
    padding: 15,
    marginBottom: 12,
    borderWidth: 2,
    borderColor: '#e0e0e0',
  },
  optionButtonSelected: {
    borderColor: '#667eea',
    backgroundColor: '#f0f0ff',
  },
  optionContent: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  optionCircle: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#f0f0f0',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 15,
  },
  optionCircleSelected: {
    backgroundColor: '#667eea',
  },
  optionLetter: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#666',
  },
  optionLetterSelected: {
    color: '#fff',
  },
  optionText: {
    flex: 1,
    fontSize: 16,
    color: '#333',
  },
  optionTextSelected: {
    color: '#667eea',
    fontWeight: '600',
  },
  nextButton: {
    backgroundColor: '#667eea',
    padding: 18,
    borderRadius: 15,
    alignItems: 'center',
  },
  nextButtonDisabled: {
    opacity: 0.5,
  },
  nextButtonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
});
