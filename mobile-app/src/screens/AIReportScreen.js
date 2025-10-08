import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  ActivityIndicator,
  Share,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import * as Clipboard from 'expo-clipboard';

export default function AIReportScreen({ route }) {
  const [loading, setLoading] = useState(false);
  const { report } = route.params || {};

  const copyToClipboard = async (text) => {
    await Clipboard.setStringAsync(text);
    alert('Copied to clipboard!');
  };

  const shareReport = async () => {
    try {
      await Share.share({
        message: `Original: ${report.originalText}\n\nCorrected: ${report.correctedText}\n\nCorrections: ${report.corrections.length}`,
      });
    } catch (error) {
      console.error('Error sharing:', error);
    }
  };

  if (!report) {
    return (
      <View style={styles.container}>
        <Text style={styles.emptyText}>No report available</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <LinearGradient
        colors={['#667eea', '#764ba2', '#f093fb']}
        style={styles.gradient}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
      />

      <ScrollView style={styles.scrollView} contentContainerStyle={styles.scrollContent}>
        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.headerIcon}>📊</Text>
          <Text style={styles.headerTitle}>AI Report</Text>
          <Text style={styles.headerSubtitle}>Powered by Google Gemini</Text>
        </View>

        {/* Summary Card */}
        <View style={styles.summaryCard}>
          <View style={styles.summaryRow}>
            <View style={styles.summaryItem}>
              <Text style={styles.summaryNumber}>{report.errorCount || 0}</Text>
              <Text style={styles.summaryLabel}>Issues Found</Text>
            </View>
            <View style={styles.summaryDivider} />
            <View style={styles.summaryItem}>
              <Text style={styles.summaryNumber}>{report.corrections?.length || 0}</Text>
              <Text style={styles.summaryLabel}>Corrections</Text>
            </View>
            <View style={styles.summaryDivider} />
            <View style={styles.summaryItem}>
              <Text style={[styles.summaryNumber, styles.successText]}>
                {report.hasErrors ? '❌' : '✅'}
              </Text>
              <Text style={styles.summaryLabel}>Status</Text>
            </View>
          </View>
        </View>

        {/* Original Text */}
        <View style={styles.card}>
          <View style={styles.cardHeader}>
            <Text style={styles.cardTitle}>📝 Original Text</Text>
            <TouchableOpacity
              style={styles.copyButton}
              onPress={() => copyToClipboard(report.originalText)}
            >
              <Text style={styles.copyButtonText}>Copy</Text>
            </TouchableOpacity>
          </View>
          <View style={styles.textBox}>
            <Text style={styles.textContent}>{report.originalText}</Text>
          </View>
        </View>

        {/* Corrections */}
        {report.corrections && report.corrections.length > 0 && (
          <View style={styles.card}>
            <Text style={styles.cardTitle}>🔍 Corrections</Text>
            {report.corrections.map((correction, index) => (
              <View key={index} style={styles.correctionCard}>
                <View style={styles.correctionHeader}>
                  <View style={styles.correctionBadge}>
                    <Text style={styles.correctionBadgeText}>
                      {correction.type || 'grammar'}
                    </Text>
                  </View>
                  <Text style={styles.correctionNumber}>#{index + 1}</Text>
                </View>
                
                <View style={styles.correctionContent}>
                  <View style={styles.correctionRow}>
                    <Text style={styles.correctionLabel}>Original:</Text>
                    <View style={styles.errorBox}>
                      <Text style={styles.errorText}>{correction.original}</Text>
                    </View>
                  </View>
                  
                  <View style={styles.arrowContainer}>
                    <Text style={styles.arrow}>↓</Text>
                  </View>
                  
                  <View style={styles.correctionRow}>
                    <Text style={styles.correctionLabel}>Correction:</Text>
                    <View style={styles.successBox}>
                      <Text style={styles.successTextContent}>{correction.correction}</Text>
                    </View>
                  </View>
                  
                  {correction.explanation && (
                    <View style={styles.explanationBox}>
                      <Text style={styles.explanationIcon}>💡</Text>
                      <Text style={styles.explanationText}>{correction.explanation}</Text>
                    </View>
                  )}
                </View>
              </View>
            ))}
          </View>
        )}

        {/* Corrected Text */}
        {report.correctedText && (
          <View style={styles.card}>
            <View style={styles.cardHeader}>
              <Text style={styles.cardTitle}>✅ Corrected Text</Text>
              <TouchableOpacity
                style={styles.copyButton}
                onPress={() => copyToClipboard(report.correctedText)}
              >
                <Text style={styles.copyButtonText}>Copy</Text>
              </TouchableOpacity>
            </View>
            <View style={[styles.textBox, styles.correctedTextBox]}>
              <Text style={styles.textContent}>{report.correctedText}</Text>
            </View>
          </View>
        )}

        {/* No Errors Message */}
        {!report.hasErrors && (
          <View style={styles.successCard}>
            <Text style={styles.successIcon}>🎉</Text>
            <Text style={styles.successTitle}>Perfect!</Text>
            <Text style={styles.successMessage}>
              No grammar or spelling errors found. Your text looks great!
            </Text>
          </View>
        )}

        {/* Action Buttons */}
        <View style={styles.actionButtons}>
          <TouchableOpacity style={styles.shareButton} onPress={shareReport}>
            <Text style={styles.shareButtonText}>📤 Share Report</Text>
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
  headerIcon: {
    fontSize: 50,
    marginBottom: 10,
  },
  headerTitle: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 5,
  },
  headerSubtitle: {
    fontSize: 14,
    color: 'rgba(255, 255, 255, 0.8)',
  },
  summaryCard: {
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
  summaryRow: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
  },
  summaryItem: {
    alignItems: 'center',
    flex: 1,
  },
  summaryNumber: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#667eea',
    marginBottom: 5,
  },
  summaryLabel: {
    fontSize: 12,
    color: '#666',
  },
  summaryDivider: {
    width: 1,
    height: 40,
    backgroundColor: '#e0e0e0',
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
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 15,
  },
  cardTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333',
  },
  copyButton: {
    backgroundColor: '#667eea',
    paddingHorizontal: 15,
    paddingVertical: 8,
    borderRadius: 8,
  },
  copyButtonText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: '600',
  },
  textBox: {
    backgroundColor: '#f9f9f9',
    borderRadius: 12,
    padding: 15,
    borderWidth: 1,
    borderColor: '#e0e0e0',
  },
  correctedTextBox: {
    backgroundColor: '#e8f5e9',
    borderColor: '#4caf50',
  },
  textContent: {
    fontSize: 16,
    color: '#333',
    lineHeight: 24,
  },
  correctionCard: {
    backgroundColor: '#f9f9f9',
    borderRadius: 12,
    padding: 15,
    marginBottom: 15,
    borderLeftWidth: 4,
    borderLeftColor: '#667eea',
  },
  correctionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 15,
  },
  correctionBadge: {
    backgroundColor: '#667eea',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 12,
  },
  correctionBadgeText: {
    color: '#fff',
    fontSize: 12,
    fontWeight: '600',
    textTransform: 'capitalize',
  },
  correctionNumber: {
    fontSize: 14,
    color: '#999',
    fontWeight: '600',
  },
  correctionContent: {
    marginTop: 10,
  },
  correctionRow: {
    marginBottom: 10,
  },
  correctionLabel: {
    fontSize: 14,
    color: '#666',
    marginBottom: 8,
    fontWeight: '600',
  },
  errorBox: {
    backgroundColor: '#ffebee',
    padding: 12,
    borderRadius: 8,
    borderLeftWidth: 3,
    borderLeftColor: '#f44336',
  },
  errorText: {
    fontSize: 16,
    color: '#c62828',
    fontWeight: '600',
  },
  arrowContainer: {
    alignItems: 'center',
    marginVertical: 8,
  },
  arrow: {
    fontSize: 24,
    color: '#667eea',
  },
  successBox: {
    backgroundColor: '#e8f5e9',
    padding: 12,
    borderRadius: 8,
    borderLeftWidth: 3,
    borderLeftColor: '#4caf50',
  },
  successTextContent: {
    fontSize: 16,
    color: '#2e7d32',
    fontWeight: '600',
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
  successCard: {
    backgroundColor: '#e8f5e9',
    borderRadius: 20,
    padding: 30,
    alignItems: 'center',
    marginBottom: 20,
  },
  successIcon: {
    fontSize: 60,
    marginBottom: 15,
  },
  successTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#2e7d32',
    marginBottom: 10,
  },
  successMessage: {
    fontSize: 16,
    color: '#4caf50',
    textAlign: 'center',
    lineHeight: 24,
  },
  successText: {
    color: '#4caf50',
  },
  actionButtons: {
    marginTop: 10,
  },
  shareButton: {
    backgroundColor: '#fff',
    padding: 16,
    borderRadius: 12,
    alignItems: 'center',
    borderWidth: 2,
    borderColor: '#667eea',
  },
  shareButtonText: {
    color: '#667eea',
    fontSize: 16,
    fontWeight: 'bold',
  },
  emptyText: {
    fontSize: 18,
    color: '#666',
    textAlign: 'center',
    marginTop: 100,
  },
});
