import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { API_BASE_URL } from '../config/api';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Auth Services
export const authService = {
  async login(username, password) {
    try {
      console.log('Attempting login to:', API_BASE_URL + '/login');
      console.log('Username:', username);
      
      const response = await api.post('/login', {
        username,
        password,
      });
      
      console.log('Login response:', response.data);
      
      if (response.data.data) {
        const token = response.data.data;
        await AsyncStorage.setItem('userToken', token);
        await AsyncStorage.setItem('username', username);
        return { success: true, token };
      } else {
        return { success: false, error: response.data.message || 'Login failed' };
      }
    } catch (error) {
      console.error('Login error:', error);
      console.error('Error details:', error.response?.data);
      
      if (error.code === 'ECONNREFUSED' || error.message.includes('Network')) {
        return { 
          success: false, 
          error: 'Cannot connect to server. Make sure backend is running on http://10.0.0.237:3000' 
        };
      }
      
      return { success: false, error: error.response?.data?.message || error.message };
    }
  },

  async signup(username, password) {
    try {
      console.log('Attempting signup to:', API_BASE_URL + '/signup');
      console.log('Username:', username);
      
      const response = await api.post('/signup', {
        username,
        password,
      });
      
      console.log('Signup response:', response.data);
      
      if (response.data.data) {
        const token = response.data.data;
        await AsyncStorage.setItem('userToken', token);
        await AsyncStorage.setItem('username', username);
        return { success: true, token };
      } else {
        return { success: false, error: response.data.message || 'Signup failed' };
      }
    } catch (error) {
      console.error('Signup error:', error);
      console.error('Error details:', error.response?.data);
      
      if (error.code === 'ECONNREFUSED' || error.message.includes('Network')) {
        return { 
          success: false, 
          error: 'Cannot connect to server. Make sure backend is running on http://10.0.0.237:3000' 
        };
      }
      
      return { success: false, error: error.response?.data?.message || error.message };
    }
  },

  async getToken() {
    return await AsyncStorage.getItem('userToken');
  },

  async getUsername() {
    return await AsyncStorage.getItem('username');
  },

  async logout() {
    await AsyncStorage.removeItem('userToken');
    await AsyncStorage.removeItem('username');
  },

  async isLoggedIn() {
    const token = await this.getToken();
    return !!token;
  },
};

// Essay Evaluation Service
export const essayService = {
  async evaluateEssay(essay, language = 'en') {
    try {
      const token = await authService.getToken();
      if (!token) {
        throw new Error('No authentication token found');
      }

      const response = await api.post('/ai/evaluation', {
        essay,
        token,
        ln: language,
      });

      return { success: true, data: response.data };
    } catch (error) {
      console.error('Essay evaluation error:', error);
      return { 
        success: false, 
        error: error.response?.data?.message || error.message 
      };
    }
  },
};

// Pronunciation Service
export const pronunciationService = {
  async getWordBreakdown(word) {
    try {
      console.log('Getting pronunciation for:', word);
      const response = await api.post('/pronunciation/breakdown', { word });
      console.log('Pronunciation response:', response.data);
      return { success: true, data: response.data };
    } catch (error) {
      console.error('Pronunciation error:', error);
      console.error('Error details:', error.response?.data);
      
      if (error.code === 'ECONNREFUSED' || error.message.includes('Network')) {
        return { 
          success: false, 
          error: 'Cannot connect to server. Make sure both backend and pronunciation service are running.' 
        };
      }
      
      return { success: false, error: error.response?.data?.message || error.message };
    }
  },

  async getRandomWords() {
    try {
      console.log('Getting random words...');
      const response = await api.get('/pronunciation/random');
      console.log('Random words response:', response.data);
      return { success: true, data: response.data };
    } catch (error) {
      console.error('Get random words error:', error);
      console.error('Error details:', error.response?.data);
      
      if (error.code === 'ECONNREFUSED' || error.message.includes('Network')) {
        return { 
          success: false, 
          error: 'Cannot connect to server. Make sure both backend and pronunciation service are running.' 
        };
      }
      
      return { success: false, error: error.response?.data?.message || error.message };
    }
  },
};

export default api;
