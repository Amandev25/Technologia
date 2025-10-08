import React, { useEffect, useRef, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Animated,
  Dimensions,
  StatusBar,
  Alert,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { authService } from '../services/api';

const { width, height } = Dimensions.get('window');

export default function HomeScreen({ navigation }) {
  const [username, setUsername] = useState('');

  useEffect(() => {
    loadUsername();
  }, []);

  const loadUsername = async () => {
    const user = await authService.getUsername();
    setUsername(user || 'User');
  };

  const handleLogout = () => {
    Alert.alert(
      'Logout',
      'Are you sure you want to logout?',
      [
        {
          text: 'Cancel',
          style: 'cancel',
        },
        {
          text: 'Logout',
          style: 'destructive',
          onPress: async () => {
            await authService.logout();
            navigation.reset({
              index: 0,
              routes: [{ name: 'Login' }],
            });
          },
        },
      ]
    );
  };
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim1 = useRef(new Animated.Value(50)).current;
  const slideAnim2 = useRef(new Animated.Value(50)).current;
  const slideAnim3 = useRef(new Animated.Value(50)).current;
  const scaleAnim = useRef(new Animated.Value(0.8)).current;
  const floatAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    // Floating animation for background elements
    Animated.loop(
      Animated.sequence([
        Animated.timing(floatAnim, {
          toValue: 1,
          duration: 3000,
          useNativeDriver: true,
        }),
        Animated.timing(floatAnim, {
          toValue: 0,
          duration: 3000,
          useNativeDriver: true,
        }),
      ])
    ).start();

    // Entrance animations
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 800,
        useNativeDriver: true,
      }),
      Animated.timing(scaleAnim, {
        toValue: 1,
        duration: 800,
        useNativeDriver: true,
      }),
      Animated.sequence([
        Animated.delay(200),
        Animated.timing(slideAnim1, {
          toValue: 0,
          duration: 600,
          useNativeDriver: true,
        }),
      ]),
      Animated.sequence([
        Animated.delay(400),
        Animated.timing(slideAnim2, {
          toValue: 0,
          duration: 600,
          useNativeDriver: true,
        }),
      ]),
      Animated.sequence([
        Animated.delay(600),
        Animated.timing(slideAnim3, {
          toValue: 0,
          duration: 600,
          useNativeDriver: true,
        }),
      ]),
    ]).start();
  }, []);

  const floatingTranslate = floatAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [0, -20],
  });

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" />
      
      {/* Animated Background */}
      <LinearGradient
        colors={['#667eea', '#764ba2', '#f093fb']}
        style={styles.gradient}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
      >
        {/* Floating circles */}
        <Animated.View
          style={[
            styles.circle1,
            {
              transform: [{ translateY: floatingTranslate }],
            },
          ]}
        />
        <Animated.View
          style={[
            styles.circle2,
            {
              transform: [
                {
                  translateY: floatAnim.interpolate({
                    inputRange: [0, 1],
                    outputRange: [0, 15],
                  }),
                },
              ],
            },
          ]}
        />
      </LinearGradient>

      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Header Section */}
        <Animated.View
          style={[
            styles.header,
            {
              opacity: fadeAnim,
              transform: [{ scale: scaleAnim }],
            },
          ]}
        >
          <View style={styles.topBar}>
            <View>
              <Text style={styles.welcomeText}>Welcome back,</Text>
              <Text style={styles.usernameText}>{username}</Text>
            </View>
            <TouchableOpacity
              style={styles.logoutButton}
              onPress={handleLogout}
              activeOpacity={0.8}
            >
              <Text style={styles.logoutText}>Logout</Text>
            </TouchableOpacity>
          </View>

          <View style={styles.logoContainer}>
            <Text style={styles.logoEmoji}>🎓</Text>
          </View>
          <Text style={styles.title}>AI Learning Hub</Text>
          <Text style={styles.subtitle}>
            Enhance your skills with AI-powered tools
          </Text>
        </Animated.View>

        {/* Feature Cards */}
        <View style={styles.cardsContainer}>
          <Animated.View
            style={{
              opacity: fadeAnim,
              transform: [{ translateY: slideAnim1 }],
            }}
          >
            <TouchableOpacity
              style={styles.card}
              onPress={() => navigation.navigate('EssayCorrector')}
              activeOpacity={0.9}
            >
              <LinearGradient
                colors={['#FF6B6B', '#FF8E53']}
                style={styles.cardGradient}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
              >
                <View style={styles.cardIconContainer}>
                  <Text style={styles.cardIcon}>📝</Text>
                </View>
                <Text style={styles.cardTitle}>Essay Corrector</Text>
                <Text style={styles.cardDescription}>
                  Get instant AI-powered feedback and improve your writing skills
                </Text>
                <View style={styles.cardArrow}>
                  <Text style={styles.arrowText}>→</Text>
                </View>
              </LinearGradient>
            </TouchableOpacity>
          </Animated.View>

          <Animated.View
            style={{
              opacity: fadeAnim,
              transform: [{ translateY: slideAnim2 }],
            }}
          >
            <TouchableOpacity
              style={styles.card}
              onPress={() => navigation.navigate('Pronunciation')}
              activeOpacity={0.9}
            >
              <LinearGradient
                colors={['#4FACFE', '#00F2FE']}
                style={styles.cardGradient}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
              >
                <View style={styles.cardIconContainer}>
                  <Text style={styles.cardIcon}>🗣️</Text>
                </View>
                <Text style={styles.cardTitle}>Pronunciation</Text>
                <Text style={styles.cardDescription}>
                  Master word pronunciations and expand your vocabulary
                </Text>
                <View style={styles.cardArrow}>
                  <Text style={styles.arrowText}>→</Text>
                </View>
              </LinearGradient>
            </TouchableOpacity>
          </Animated.View>

          <Animated.View
            style={{
              opacity: fadeAnim,
              transform: [{ translateY: slideAnim3 }],
            }}
          >
            <View style={styles.statsCard}>
              <Text style={styles.statsTitle}>Your Progress</Text>
              <View style={styles.statsRow}>
                <View style={styles.statItem}>
                  <Text style={styles.statNumber}>0</Text>
                  <Text style={styles.statLabel}>Essays</Text>
                </View>
                <View style={styles.statDivider} />
                <View style={styles.statItem}>
                  <Text style={styles.statNumber}>0</Text>
                  <Text style={styles.statLabel}>Words</Text>
                </View>
                <View style={styles.statDivider} />
                <View style={styles.statItem}>
                  <Text style={styles.statNumber}>0</Text>
                  <Text style={styles.statLabel}>Days</Text>
                </View>
              </View>
            </View>
          </Animated.View>
        </View>

        {/* Footer */}
        <Animated.View style={[styles.footer, { opacity: fadeAnim }]}>
          <Text style={styles.footerText}>
            Start your learning journey today
          </Text>
        </Animated.View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#667eea',
  },
  gradient: {
    position: 'absolute',
    left: 0,
    right: 0,
    top: 0,
    height: height,
  },
  circle1: {
    position: 'absolute',
    width: 200,
    height: 200,
    borderRadius: 100,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    top: -50,
    right: -50,
  },
  circle2: {
    position: 'absolute',
    width: 150,
    height: 150,
    borderRadius: 75,
    backgroundColor: 'rgba(255, 255, 255, 0.08)',
    bottom: 100,
    left: -30,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingBottom: 40,
  },
  header: {
    alignItems: 'center',
    paddingTop: 60,
    paddingHorizontal: 20,
    marginBottom: 40,
  },
  topBar: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    width: '100%',
    marginBottom: 30,
  },
  welcomeText: {
    fontSize: 14,
    color: 'rgba(255, 255, 255, 0.8)',
  },
  usernameText: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#fff',
  },
  logoutButton: {
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.3)',
  },
  logoutText: {
    color: '#fff',
    fontWeight: '600',
    fontSize: 14,
  },
  logoContainer: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 20,
    borderWidth: 3,
    borderColor: 'rgba(255, 255, 255, 0.3)',
  },
  logoEmoji: {
    fontSize: 50,
  },
  title: {
    fontSize: 36,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 10,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 16,
    color: 'rgba(255, 255, 255, 0.9)',
    textAlign: 'center',
    paddingHorizontal: 20,
  },
  cardsContainer: {
    paddingHorizontal: 20,
  },
  card: {
    marginBottom: 20,
    borderRadius: 20,
    overflow: 'hidden',
    elevation: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
  },
  cardGradient: {
    padding: 25,
    minHeight: 180,
  },
  cardIconContainer: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: 'rgba(255, 255, 255, 0.3)',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 15,
  },
  cardIcon: {
    fontSize: 30,
  },
  cardTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 8,
  },
  cardDescription: {
    fontSize: 14,
    color: 'rgba(255, 255, 255, 0.9)',
    lineHeight: 20,
    marginBottom: 15,
  },
  cardArrow: {
    position: 'absolute',
    right: 25,
    bottom: 25,
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(255, 255, 255, 0.3)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  arrowText: {
    fontSize: 20,
    color: '#fff',
    fontWeight: 'bold',
  },
  statsCard: {
    backgroundColor: 'rgba(255, 255, 255, 0.95)',
    borderRadius: 20,
    padding: 25,
    marginBottom: 20,
  },
  statsTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 20,
    textAlign: 'center',
  },
  statsRow: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
  },
  statItem: {
    alignItems: 'center',
    flex: 1,
  },
  statNumber: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#667eea',
    marginBottom: 5,
  },
  statLabel: {
    fontSize: 14,
    color: '#666',
  },
  statDivider: {
    width: 1,
    height: 40,
    backgroundColor: '#ddd',
  },
  footer: {
    alignItems: 'center',
    paddingTop: 20,
  },
  footerText: {
    fontSize: 14,
    color: 'rgba(255, 255, 255, 0.8)',
    textAlign: 'center',
  },
});
