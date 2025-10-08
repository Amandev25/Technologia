import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Switch,
  Alert,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { clipboardMonitorService } from '../services/clipboardMonitor';
import * as Notifications from 'expo-notifications';

export default function ClipboardMonitorScreen({ navigation }) {
  const [isMonitoring, setIsMonitoring] = useState(false);
  const [reports, setReports] = useState([]);

  useEffect(() => {
    checkMonitoringStatus();
    setupNotificationListener();
    loadReports();
  }, []);

  const checkMonitoringStatus = async () => {
    const status = await clipboardMonitorService.isMonitoring();
    setIsMonitoring(status);
  };

  const loadReports = async () => {
    try {
      const stored = await AsyncStorage.getItem('aiReports');
      if (stored) {
        setReports(JSON.parse(stored));
      }
    } catch (error) {
      console.error('Error loading reports:', error);
    }
  };

  const setupNotificationListener = () => {
    const subscription = Notifications.addNotificationReceivedListener(notification => {
      if (notification.request.content.data.type === 'grammar_check') {
        const reportData = notification.request.content.data;
        saveReport(reportData);
      }
    });

    // Handle notification tap
    const responseSubscription = Notifications.addNotificationResponseReceivedListener(response => {
      if (response.notification.request.content.data.type === 'grammar_check') {
        const reportData = response.notification.request.content.data;
        navigation.navigate('AIReport', { report: reportData });
      }
    });

    return () => {
      subscription.remove();
      responseSubscription.remove();
    };
  };

  const saveReport = async (reportData) => {
    try {
      const newReport = {
        id: Date.now().toString(),
        timestamp: new Date().toISOString(),
        ...reportData,
      };

      const updatedReports = [newReport, ...reports].slice(0, 20);
      setReports(updatedReports);
      await AsyncStorage.setItem('aiReports', JSON.stringify(updatedReports));
    } catch (error) {
      console.error('Error saving report:', error);
    }
  };

  const toggleMonitoring = async () => {
    if (isMonitoring) {
      await clipboardMonitorService.stopMonitoring();
      setIsMonitoring(false);
      Alert.alert('Stopped', 'Clipboard monitoring stopped');
    } else {
      const started = await clipboardMonitorService.startMonitoring();
      if (started) {
        setIsMonitoring(true);
        Alert.alert(
          'Started',
          'Clipboard monitoring is now active!\n\nCopy any text from any app and we\'ll check it for errors.'
        );
      } else {
        Alert.alert('Error', 'Failed to start monitoring. Please enable notifications.');
      }
    }
  };

  const testMonitor = async () => {
    Alert.alert(
      'Test Clipboard Monitor',
      'Copy some text from any app (WhatsApp, Notes, etc.) and come back here. You should see a notification with suggestions!',
      [{ text: 'OK' }]
    );
  };

  return (
    <View style={styles.container}>
      <LinearGradient
        colors={['#667eea', '#764ba2', '#f093fb']}
        style={styles.gradient}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
      />

      <ScrollView style={styles.scrollView} contentContainerStyle={styles.scrollContent}>
        <View style={styles.content}>
          <View style={styles.header}>
            <Text style={styles.icon}>📋</Text>
            <Text style={styles.title}>Clipboard Assistant</Text>
            <Text style={styles.subtitle}>
              Auto-check grammar when you copy text
            </Text>
          </View>

          <View style={styles.card}>
            <View style={styles.monitorSection}>
              <View style={styles.monitorInfo}>
                <Text style={styles.monitorTitle}>Background Monitoring</Text>
                <Text style={styles.monitorDescription}>
                  {isMonitoring
                    ? '✅ Active - Checking copied text'
                    : '⏸️ Inactive - Not monitoring'}
                </Text>
              </View>
              <Switch
                value={isMonitoring}
                onValueChange={toggleMonitoring}
                trackColor={{ false: '#ccc', true: '#667eea' }}
                thumbColor={isMonitoring ? '#fff' : '#f4f3f4'}
              />
            </View>

            <View style={styles.divider} />

            <View style={styles.howItWorks}>
              <Text style={styles.sectionTitle}>How It Works</Text>
              <View style={styles.step}>
                <Text style={styles.stepNumber}>1</Text>
                <Text style={styles.stepText}>
                  Copy text from any app (WhatsApp, Gmail, Notes, etc.)
                </Text>
              </View>
              <View style={styles.step}>
                <Text style={styles.stepNumber}>2</Text>
                <Text style={styles.stepText}>
                  We automatically check for grammar and spelling errors
                </Text>
              </View>
              <View style={styles.step}>
                <Text style={styles.stepNumber}>3</Text>
                <Text style={styles.stepText}>
                  Get instant notification with suggestions
                </Text>
              </View>
              <View style={styles.step}>
                <Text style={styles.stepNumber}>4</Text>
                <Text style={styles.stepText}>
                  Tap notification to see corrections
                </Text>
              </View>
            </View>

            <TouchableOpacity style={styles.testButton} onPress={testMonitor}>
              <Text style={styles.testButtonText}>🧪 Test Monitor</Text>
            </TouchableOpacity>
          </View>

          {reports.length > 0 && (
            <View style={styles.card}>
              <Text style={styles.sectionTitle}>Recent Reports</Text>
              {reports.map((report, index) => (
                <TouchableOpacity
                  key={report.id || index}
                  style={styles.reportCard}
                  onPress={() => navigation.navigate('AIReport', { report })}
                >
                  <View style={styles.reportHeader}>
                    <Text style={styles.reportIcon}>
                      {report.hasErrors ? '📝' : '✅'}
                    </Text>
                    <View style={styles.reportInfo}>
                      <Text style={styles.reportTitle}>
                        {report.hasErrors
                          ? `${report.errorCount} issue${report.errorCount > 1 ? 's' : ''} found`
                          : 'No errors found'}
                      </Text>
                      <Text style={styles.reportText} numberOfLines={2}>
                        {report.originalText}
                      </Text>
                      <Text style={styles.reportTime}>
                        {new Date(report.timestamp).toLocaleString()}
                      </Text>
                    </View>
                    <Text style={styles.reportArrow}>→</Text>
                  </View>
                </TouchableOpacity>
              ))}
            </View>
          )}

          <View style={styles.infoCard}>
            <Text style={styles.infoTitle}>💡 Tips</Text>
            <Text style={styles.infoText}>
              • Works in background even when app is closed{'\n'}
              • Only checks text longer than 20 characters{'\n'}
              • Notifications appear instantly{'\n'}
              • Your text is analyzed securely{'\n'}
              • Toggle off when not needed to save battery
            </Text>
          </View>
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
    paddingBottom: 40,
  },
  content: {
    padding: 20,
  },
  header: {
    alignItems: 'center',
    marginTop: 40,
    marginBottom: 30,
  },
  icon: {
    fontSize: 60,
    marginBottom: 15,
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
    marginBottom: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 5,
  },
  monitorSection: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  monitorInfo: {
    flex: 1,
  },
  monitorTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 5,
  },
  monitorDescription: {
    fontSize: 14,
    color: '#666',
  },
  divider: {
    height: 1,
    backgroundColor: '#e0e0e0',
    marginVertical: 20,
  },
  howItWorks: {
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 15,
  },
  step: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 15,
  },
  stepNumber: {
    width: 30,
    height: 30,
    borderRadius: 15,
    backgroundColor: '#667eea',
    color: '#fff',
    textAlign: 'center',
    lineHeight: 30,
    fontWeight: 'bold',
    marginRight: 12,
  },
  stepText: {
    flex: 1,
    fontSize: 14,
    color: '#666',
    lineHeight: 20,
    paddingTop: 5,
  },
  testButton: {
    backgroundColor: '#667eea',
    padding: 16,
    borderRadius: 12,
    alignItems: 'center',
  },
  testButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  reportCard: {
    backgroundColor: '#f9f9f9',
    padding: 15,
    borderRadius: 12,
    marginBottom: 10,
    borderLeftWidth: 4,
    borderLeftColor: '#667eea',
  },
  reportHeader: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  reportIcon: {
    fontSize: 30,
    marginRight: 12,
  },
  reportInfo: {
    flex: 1,
  },
  reportTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 5,
  },
  reportText: {
    fontSize: 14,
    color: '#666',
    marginBottom: 5,
  },
  reportTime: {
    fontSize: 12,
    color: '#999',
  },
  reportArrow: {
    fontSize: 20,
    color: '#667eea',
    marginLeft: 10,
  },
  infoCard: {
    backgroundColor: 'rgba(255, 255, 255, 0.95)',
    borderRadius: 20,
    padding: 20,
    borderWidth: 2,
    borderColor: 'rgba(255, 255, 255, 0.5)',
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
});
