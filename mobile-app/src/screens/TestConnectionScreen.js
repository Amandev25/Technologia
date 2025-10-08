import React, { useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  ActivityIndicator,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import axios from 'axios';
import { API_BASE_URL } from '../config/api';

export default function TestConnectionScreen() {
  const [result, setResult] = useState('');
  const [loading, setLoading] = useState(false);

  const testConnection = async () => {
    setLoading(true);
    setResult('Testing connection...\n\n');

    try {
      // Test 1: Basic connection
      setResult(prev => prev + '1. Testing basic connection...\n');
      const baseUrl = API_BASE_URL.replace('/api/v1/ai', '');
      const response1 = await axios.get(`${baseUrl}/test`, { timeout: 5000 });
      setResult(prev => prev + `✅ Backend is reachable!\n${JSON.stringify(response1.data, null, 2)}\n\n`);

      // Test 2: API endpoint
      setResult(prev => prev + '2. Testing API endpoint...\n');
      const response2 = await axios.get(`${API_BASE_URL}/get-on-define`, { timeout: 5000 });
      setResult(prev => prev + `✅ API endpoint works!\n\n`);

      // Test 3: Signup endpoint
      setResult(prev => prev + '3. Testing signup endpoint...\n');
      const testUser = `test_${Date.now()}`;
      const response3 = await axios.post(`${API_BASE_URL}/signup`, {
        username: testUser,
        password: 'test123',
      }, { timeout: 5000 });
      setResult(prev => prev + `✅ Signup works!\n${JSON.stringify(response3.data, null, 2)}\n\n`);

      setResult(prev => prev + '🎉 All tests passed! Your backend is connected properly.');
    } catch (error) {
      setResult(prev => prev + `\n❌ Error: ${error.message}\n\n`);
      
      if (error.code === 'ECONNABORTED') {
        setResult(prev => prev + 'Connection timeout. Backend might be slow or not running.\n');
      } else if (error.code === 'ECONNREFUSED') {
        setResult(prev => prev + 'Connection refused. Make sure backend is running.\n');
      } else if (error.message.includes('Network')) {
        setResult(prev => prev + 'Network error. Check:\n');
        setResult(prev => prev + '1. Backend is running\n');
        setResult(prev => prev + '2. Both devices on same WiFi\n');
        setResult(prev => prev + '3. IP address is correct: 10.0.0.237\n');
        setResult(prev => prev + '4. Windows Firewall allows port 3000\n');
      }
      
      setResult(prev => prev + `\nFull error: ${JSON.stringify(error, null, 2)}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <LinearGradient
        colors={['#667eea', '#764ba2']}
        style={styles.gradient}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
      />

      <View style={styles.content}>
        <Text style={styles.title}>Connection Test</Text>
        <Text style={styles.subtitle}>
          Testing: {API_BASE_URL}
        </Text>

        <TouchableOpacity
          style={styles.button}
          onPress={testConnection}
          disabled={loading}
        >
          {loading ? (
            <ActivityIndicator color="#fff" />
          ) : (
            <Text style={styles.buttonText}>Run Connection Test</Text>
          )}
        </TouchableOpacity>

        <ScrollView style={styles.resultContainer}>
          <Text style={styles.resultText}>{result}</Text>
        </ScrollView>
      </View>
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
  content: {
    flex: 1,
    padding: 20,
    paddingTop: 60,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 10,
  },
  subtitle: {
    fontSize: 12,
    color: 'rgba(255, 255, 255, 0.8)',
    marginBottom: 20,
  },
  button: {
    backgroundColor: 'rgba(255, 255, 255, 0.3)',
    padding: 16,
    borderRadius: 12,
    alignItems: 'center',
    marginBottom: 20,
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  resultContainer: {
    flex: 1,
    backgroundColor: 'rgba(255, 255, 255, 0.95)',
    borderRadius: 12,
    padding: 15,
  },
  resultText: {
    fontSize: 12,
    color: '#333',
    fontFamily: 'monospace',
  },
});
