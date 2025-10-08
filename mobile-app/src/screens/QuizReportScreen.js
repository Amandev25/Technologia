import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';

export default function QuizReportScreen({ route, navigation }) {
  const { report } = route.params || {};

  if (!report) {
    return (
      <View style={styles.container}>
        <Text style={styles.emptyText}>No report available</Text>
      </View>
    );
  }

  const getScoreColor = (score) => {
    if (score >= 80) return '#4caf50';
    if (score >= 60) return '#ff9800';
    return '#f44336';
  };

  return (
    <View style={styles.container}>
      <LinearGradient
        colors={report.passed ? ['#4caf50', '#8bc34a'] : ['#f44336', '#ff5722']}
        style={styles.gradient}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
      />

      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Result Header */}
        <View style={styles.header}>
          <Text style={styles.resultIcon}>{report.passed ? '🎉' : '📚'}</Text>
          <Text style={styles.resultTitle}>
            {report.passed ? 'Congratulations!' : 'Keep Learning!'}
          </Text>
          <Text style={styles.resultMessage}>{report.message}</Text>
        </View>

        {/* Score Card */}
        <View style={styles.scoreCard}>
          <View style={styles.scoreCircle}>
            <Text style={[styles.scoreNumber, { color: getScoreColor(report.score) }]}>
              {report.score}%
            </Text>
            <Text style={styles.scoreLabel}>Score</Text>
          </View>
          
          <View style={styles.statsGrid}>
            <View style={styles.statItem}>
              <Text style={styles.statNumber}>{report.correctAnswers}</Text>
              <Text style={styles.statLabel}>✅ Correct</Text>
            </View>
            <View style={styles.statItem}>
              <Text style={styles.statNumber}>{report.incorrectAnswers}</Text>
              <Text style={styles.statLabel}>❌ Wrong</Text>
            </View>
            <View style={styles.statItem}>
              <Text style={styles.statNumber}>{report.totalQuestions}</Text>
              <Text style={styles.statLabel}>📝 Total</Text>
            </View>
          </View>
        </View>

        {/* Level Info */}
        <View style={styles.levelCard}>
          <Text style={styles.levelText}>
            Level {report.level} Completed
          </Text>
          {report.passed && report.nextLevel <= 3 && (
            <Text style={styles.nextLevelText}>
              🎯 Level {report.nextLevel} Unlocked!
            </Text>
          )}
        </View>

        {/* Detailed Results */}
        <View style={styles.card}>
          <Text style={styles.cardTitle}>📊 Detailed Results</Text>
          
          {report.results.map((result, index) => (
            <View
              key={index}
              style={[
                styles.resultItem,
                result.isCorrect ? styles.resultCorrect : styles.resultWrong,
              ]}
            >
              <View style={styles.resultHeader}>
                <Text style={styles.resultNumber}>Q{index + 1}</Text>
                <Text style={styles.resultStatus}>
                  {result.isCorrect ? '✅ Correct' : '❌ Wrong'}
                </Text>
              </View>
              
              <Text style={styles.resultQuestion}>{result.question}</Text>
              
              <View style={styles.answerRow}>
                <Text style={styles.answerLabel}>Your Answer:</Text>
                <View
                  style={[
                    styles.answerBadge,
                    result.isCorrect ? styles.answerCorrect : styles.answerWrong,
                  ]}
                >
                  <Text style={styles.answerText}>{result.userAnswer}</Text>
                </View>
              </View>
              
              {!result.isCorrect && (
                <View style={styles.answerRow}>
                  <Text style={styles.answerLabel}>Correct Answer:</Text>
                  <View style={[styles.answerBadge, styles.answerCorrect]}>
                    <Text style={styles.answerText}>{result.correctAnswer}</Text>
                  </View>
                </View>
              )}
              
              <View style={styles.explanationBox}>
                <Text style={styles.explanationIcon}>💡</Text>
                <Text style={styles.explanationText}>{result.explanation}</Text>
              </View>
            </View>
          ))}
        </View>

        {/* Action Buttons */}
        <View style={styles.actionButtons}>
          {report.passed && report.nextLevel <= 3 ? (
            <TouchableOpacity
              style={styles.primaryButton}
              onPress={() => navigation.navigate('Quiz')}
            >
              <LinearGradient
                colors={['#667eea', '#764ba2']}
                style={styles.buttonGradient}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 0 }}
              >
                <Text style={styles.primaryButtonText}>
                  🚀 Next Level
                </Text>
              </LinearGradient>
            </TouchableOpacity>
          ) : (
            <TouchableOpacity
              style={styles.primaryButton}
              onPress={() => navigation.navigate('Quiz')}
            >
              <LinearGradient
                colors={['#FF6B6B', '#FF8E53']}
                style={styles.buttonGradient}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 0 }}
              >
                <Text style={styles.primaryButtonText}>
                  🔄 Try Again
                </Text>
              </LinearGradient>
            </TouchableOpacity>
          )}
          
          <TouchableOpacity
            style={styles.secondaryButton}
            onPress={() => navigation.navigate('HomeTab')}
          >
            <Text style={styles.secondaryButtonText}>🏠 Home</Text>
          </TouchableOpacity>
        </View>
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
  header: {
    alignItems: 'center',
    marginTop: 20,
    marginBottom: 30,
  },
  resultIcon: {
    fontSize: 80,
    marginBottom: 15,
  },
  resultTitle: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 10,
  },
  resultMessage: {
    fontSize: 16,
    color: 'rgba(255, 255, 255, 0.9)',
    textAlign: 'center',
  },
  scoreCard: {
    backgroundColor: '#fff',
    borderRadius: 20,
    padding: 25,
    marginBottom: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 5,
  },
  scoreCircle: {
    alignItems: 'center',
    marginBottom: 25,
  },
  scoreNumber: {
    fontSize: 60,
    fontWeight: 'bold',
    marginBottom: 5,
  },
  scoreLabel: {
    fontSize: 16,
    color: '#666',
  },
  statsGrid: {
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
  statItem: {
    alignItems: 'center',
  },
  statNumber: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 5,
  },
  statLabel: {
    fontSize: 14,
    color: '#666',
  },
  levelCard: {
    backgroundColor: 'rgba(255, 255, 255, 0.95)',
    borderRadius: 15,
    padding: 20,
    marginBottom: 20,
    alignItems: 'center',
  },
  levelText: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 5,
  },
  nextLevelText: {
    fontSize: 16,
    color: '#4caf50',
    fontWeight: '600',
  },
  card: {
    backgroundColor: '#fff',
    borderRadius: 20,
    padding: 20,
    marginBottom: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 5,
  },
  cardTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 20,
  },
  resultItem: {
    borderRadius: 12,
    padding: 15,
    marginBottom: 15,
    borderLeftWidth: 4,
  },
  resultCorrect: {
    backgroundColor: '#e8f5e9',
    borderLeftColor: '#4caf50',
  },
  resultWrong: {
    backgroundColor: '#ffebee',
    borderLeftColor: '#f44336',
  },
  resultHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 10,
  },
  resultNumber: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#666',
  },
  resultStatus: {
    fontSize: 14,
    fontWeight: '600',
  },
  resultQuestion: {
    fontSize: 16,
    color: '#333',
    marginBottom: 12,
    lineHeight: 22,
  },
  answerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  answerLabel: {
    fontSize: 14,
    color: '#666',
    marginRight: 10,
    fontWeight: '600',
  },
  answerBadge: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 8,
  },
  answerCorrect: {
    backgroundColor: '#4caf50',
  },
  answerWrong: {
    backgroundColor: '#f44336',
  },
  answerText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 16,
  },
  explanationBox: {
    flexDirection: 'row',
    backgroundColor: '#fff3e0',
    padding: 12,
    borderRadius: 8,
    marginTop: 10,
  },
  explanationIcon: {
    fontSize: 20,
    marginRight: 10,
  },
  explanationText: {
    flex: 1,
    fontSize: 14,
    color: '#e65100',
    lineHeight: 20,
  },
  actionButtons: {
    marginTop: 10,
  },
  primaryButton: {
    borderRadius: 15,
    overflow: 'hidden',
    marginBottom: 15,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 5,
  },
  buttonGradient: {
    padding: 18,
    alignItems: 'center',
  },
  primaryButtonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
  secondaryButton: {
    backgroundColor: '#fff',
    padding: 18,
    borderRadius: 15,
    alignItems: 'center',
    borderWidth: 2,
    borderColor: 'rgba(255, 255, 255, 0.5)',
  },
  secondaryButtonText: {
    color: '#333',
    fontSize: 18,
    fontWeight: 'bold',
  },
  emptyText: {
    fontSize: 18,
    color: '#666',
    textAlign: 'center',
    marginTop: 100,
  },
});
