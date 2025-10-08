import React, { useState, useEffect } from 'react';
import { View, ActivityIndicator, StyleSheet } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

import LoginScreen from '../screens/LoginScreen';
import SignupScreen from '../screens/SignupScreen';
import HomeScreen from '../screens/HomeScreen';
import EssayCorrectorScreen from '../screens/EssayCorrectorScreen';
import PronunciationScreen from '../screens/PronunciationScreen';
import ClipboardMonitorScreen from '../screens/ClipboardMonitorScreen';
import AIReportScreen from '../screens/AIReportScreen';
import QuizScreen from '../screens/QuizScreen';
import QuizReportScreen from '../screens/QuizReportScreen';
import { authService } from '../services/api';

const Stack = createNativeStackNavigator();
const Tab = createBottomTabNavigator();

function HomeStack() {
  return (
    <Stack.Navigator>
      <Stack.Screen
        name="Home"
        component={HomeScreen}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="EssayCorrector"
        component={EssayCorrectorScreen}
        options={{ title: 'Essay Corrector' }}
      />
      <Stack.Screen
        name="Pronunciation"
        component={PronunciationScreen}
        options={{ title: 'Pronunciation' }}
      />
      <Stack.Screen
        name="AIReport"
        component={AIReportScreen}
        options={{ title: 'AI Report' }}
      />
      <Stack.Screen
        name="Quiz"
        component={QuizScreen}
        options={{ title: 'Quiz Time' }}
      />
      <Stack.Screen
        name="QuizReport"
        component={QuizReportScreen}
        options={{ title: 'Quiz Results', headerShown: false }}
      />
    </Stack.Navigator>
  );
}

function MainTabs() {
  return (
    <Tab.Navigator
      screenOptions={{
        tabBarActiveTintColor: '#667eea',
        tabBarInactiveTintColor: '#8E8E93',
        tabBarStyle: {
          paddingBottom: 5,
          paddingTop: 5,
          height: 60,
        },
      }}
    >
      <Tab.Screen
        name="HomeTab"
        component={HomeStack}
        options={{
          headerShown: false,
          tabBarLabel: 'Home',
          tabBarIcon: () => null,
        }}
      />
      <Tab.Screen
        name="EssayTab"
        component={EssayCorrectorScreen}
        options={{
          tabBarLabel: 'Essay',
          title: 'Essay Corrector',
          tabBarIcon: () => null,
        }}
      />
      <Tab.Screen
        name="PronunciationTab"
        component={PronunciationScreen}
        options={{
          tabBarLabel: 'Pronunciation',
          title: 'Pronunciation',
          tabBarIcon: () => null,
        }}
      />
      <Tab.Screen
        name="ClipboardTab"
        component={ClipboardMonitorScreen}
        options={{
          tabBarLabel: 'Assistant',
          title: 'Clipboard Assistant',
          tabBarIcon: () => null,
        }}
      />
      <Tab.Screen
        name="QuizTab"
        component={QuizScreen}
        options={{
          tabBarLabel: 'Quiz',
          title: 'Quiz Time',
          tabBarIcon: () => null,
        }}
      />
    </Tab.Navigator>
  );
}

export default function AppNavigator() {
  const [isLoading, setIsLoading] = useState(true);
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    checkLoginStatus();
  }, []);

  const checkLoginStatus = async () => {
    try {
      const loggedIn = await authService.isLoggedIn();
      setIsLoggedIn(loggedIn);
    } catch (error) {
      console.error('Error checking login status:', error);
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#667eea" />
      </View>
    );
  }

  return (
    <NavigationContainer>
      <Stack.Navigator screenOptions={{ headerShown: false }}>
        {isLoggedIn ? (
          <Stack.Screen name="Main" component={MainTabs} />
        ) : (
          <>
            <Stack.Screen name="Login" component={LoginScreen} />
            <Stack.Screen name="Signup" component={SignupScreen} />
            <Stack.Screen name="Main" component={MainTabs} />
          </>
        )}
      </Stack.Navigator>
    </NavigationContainer>
  );
}

const styles = StyleSheet.create({
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#fff',
  },
});
