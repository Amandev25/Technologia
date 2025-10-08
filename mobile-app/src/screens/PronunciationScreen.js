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
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Audio } from 'expo-av';
import { pronunciationService } from '../services/api';

export default function PronunciationScreen() {
  const [word, setWord] = useState('');
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [randomWords, setRandomWords] = useState(null);
  const [loadingRandom, setLoadingRandom] = useState(false);
  
  // Audio states
  const [playingAudio, setPlayingAudio] = useState(null);
  const [currentSound, setCurrentSound] = useState(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [audioReady, setAudioReady] = useState(false);

  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(30)).current;

  useEffect(() => {
    setupAudio();
    
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

    return () => {
      if (currentSound) {
        currentSound.unloadAsync();
      }
    };
  }, []);

  const setupAudio = async () => {
    try {
      await Audio.setAudioModeAsync({
        allowsRecordingIOS: false,
        playsInSilentModeIOS: true,
        staysActiveInBackground: false,
        shouldDuckAndroid: true,
        playThroughEarpieceAndroid: false,
      });
      setAudioReady(true);
      console.log('Audio mode set successfully');
    } catch (error) {
      console.error('Error setting audio mode:', error);
      Alert.alert('Audio Setup Error', 'Failed to initialize audio. Please restart the app.');
    }
  };

  const playBase64Audio = async (base64Audio, audioId) => {
    try {
      console.log('Attempting to play audio:', audioId);
      console.log('Base64 length:', base64Audio?.length);
      console.log('Audio ready:', audioReady);

      if (!audioReady) {
        Alert.alert('Audio Not Ready', 'Please wait for audio to initialize');
        return;
      }

      if (!base64Audio) {
        Alert.alert('No Audio', 'No audio data available for this word');
        return;
      }

      // Stop current audio if playing
      if (currentSound) {
        console.log('Stopping current sound');
        await currentSound.stopAsync();
        await currentSound.unloadAsync();
        setCurrentSound(null);
        setIsPlaying(false);
      }

      // If clicking the same audio that's playing, just stop it
      if (playingAudio === audioId && isPlaying) {
        console.log('Stopping same audio');
        setPlayingAudio(null);
        return;
      }

      console.log('Creating sound from base64...');
      
      // Play new audio
      const { sound } = await Audio.Sound.createAsync(
        { uri: `data:audio/mp3;base64,${base64Audio}` },
        { shouldPlay: true, volume: 1.0 },
        (status) => {
          console.log('Playback status:', status);
        }
      );

      console.log('Sound created successfully');

      setCurrentSound(sound);
      setPlayingAudio(audioId);
      setIsPlaying(true);

      // Get initial status
      const status = await sound.getStatusAsync();
      console.log('Initial sound status:', status);

      sound.setOnPlaybackStatusUpdate((status) => {
        console.log('Playback update:', status);
        if (status.didJustFinish) {
          console.log('Audio finished playing');
          setIsPlaying(false);
          setPlayingAudio(null);
        }
        if (status.error) {
          console.error('Playback error:', status.error);
        }
      });

      // Verify it's actually playing
      setTimeout(async () => {
        const currentStatus = await sound.getStatusAsync();
        console.log('Status after 500ms:', currentStatus);
        if (!currentStatus.isPlaying) {
          console.warn('Audio not playing after 500ms!');
          Alert.alert('Audio Issue', 'Audio loaded but not playing. Check device volume.');
        }
      }, 500);

    } catch (error) {
      console.error('Error playing audio:', error);
      console.error('Error details:', JSON.stringify(error, null, 2));
      Alert.alert('Audio Error', `Failed to play audio: ${error.message}`);
      setIsPlaying(false);
      setPlayingAudio(null);
    }
  };

  const handleSubmitWord = async () => {
    if (!word.trim()) {
      Alert.alert('Error', 'Please enter a word');
      return;
    }

    setLoading(true);
    setResult(null);

    const response = await pronunciationService.getWordBreakdown(word);

    setLoading(false);

    if (response.success) {
      setResult(response.data.data);
    } else {
      Alert.alert('Error', response.error || 'Failed to get pronunciation.');
    }
  };

  const handleGetRandomWord = async () => {
    setLoadingRandom(true);
    setRandomWords(null);

    const response = await pronunciationService.getRandomWords();

    setLoadingRandom(false);

    if (response.success) {
      setRandomWords(response.data.data);
    } else {
      Alert.alert('Error', response.error || 'Failed to get random words.');
    }
  };

  const renderWordCard = (wordData, cardId) => {
    if (!wordData) return null;

    return (
      <View style={styles.wordCard}>
        <View style={styles.wordHeader}>
          <Text style={styles.wordTitle}>{wordData.word}</Text>
          <View style={styles.languageBadge}>
            <Text style={styles.languageText}>{wordData.language}</Text>
          </View>
        </View>

        {/* Full Word Audio */}
        {wordData.full_audio_base64 && (
          <TouchableOpacity
            style={[
              styles.audioButton,
              playingAudio === `${cardId}-full` && isPlaying && styles.audioButtonPlaying,
            ]}
            onPress={() => playBase64Audio(wordData.full_audio_base64, `${cardId}-full`)}
          >
            <Text style={styles.audioIcon}>
              {playingAudio === `${cardId}-full` && isPlaying ? '⏸️' : '▶️'}
            </Text>
            <Text style={styles.audioButtonText}>
              {playingAudio === `${cardId}-full` && isPlaying ? 'Pause Full Word' : 'Play Full Word'}
            </Text>
          </TouchableOpacity>
        )}

        {/* Syllables/Chunks */}
        {wordData.syllables && wordData.syllables.length > 0 && (
          <View style={styles.syllablesContainer}>
            <Text style={styles.syllablesTitle}>Breakdown:</Text>
            {wordData.syllables.map((syllable, index) => (
              <View key={index} style={styles.syllableCard}>
                <View style={styles.syllableHeader}>
                  <Text style={styles.syllableText}>{syllable.text}</Text>
                  {syllable.example_word_sound && syllable.example_word_sound !== 'N/A' && (
                    <Text style={styles.exampleText}>
                      (sounds like: {syllable.example_word_sound})
                    </Text>
                  )}
                </View>
                {syllable.audio_base64 && (
                  <TouchableOpacity
                    style={[
                      styles.syllableAudioButton,
                      playingAudio === `${cardId}-${index}` && isPlaying && styles.syllableAudioButtonPlaying,
                    ]}
                    onPress={() => playBase64Audio(syllable.audio_base64, `${cardId}-${index}`)}
                  >
                    <Text style={styles.syllableAudioIcon}>
                      {playingAudio === `${cardId}-${index}` && isPlaying ? '⏸️' : '▶️'}
                    </Text>
                  </TouchableOpacity>
                )}
              </View>
            ))}
          </View>
        )}
      </View>
    );
  };

  return (
    <View style={styles.container}>
      <LinearGradient
        colors={['#4FACFE', '#00F2FE', '#43E97B']}
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
              <Text style={styles.icon}>🗣️</Text>
            </View>
            <Text style={styles.title}>Pronunciation</Text>
            <Text style={styles.subtitle}>
              Master word pronunciations and vocabulary
            </Text>
            {!audioReady && (
              <View style={styles.audioWarning}>
                <Text style={styles.audioWarningText}>⚠️ Audio initializing...</Text>
              </View>
            )}
          </View>

          {/* Search Word Section */}
          <View style={styles.card}>
            <Text style={styles.sectionLabel}>Search Word</Text>
            <TextInput
              style={styles.input}
              placeholder="Enter a word..."
              placeholderTextColor="#999"
              value={word}
              onChangeText={setWord}
              autoCapitalize="none"
            />

            <TouchableOpacity
              style={[styles.button, loading && styles.buttonDisabled]}
              onPress={handleSubmitWord}
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
                  <Text style={styles.buttonText}>🔍 Get Pronunciation</Text>
                )}
              </LinearGradient>
            </TouchableOpacity>

            {result && renderWordCard(result, 'search')}
          </View>

          <View style={styles.divider} />

          {/* Random Words Section */}
          <View style={styles.card}>
            <Text style={styles.sectionLabel}>Words of the Day</Text>
            <Text style={styles.sectionDescription}>
              Discover new words in English, Hindi, and Telugu
            </Text>

            <TouchableOpacity
              style={[styles.button, loadingRandom && styles.buttonDisabled]}
              onPress={handleGetRandomWord}
              disabled={loadingRandom}
              activeOpacity={0.8}
            >
              <LinearGradient
                colors={loadingRandom ? ['#ccc', '#999'] : ['#FF6B6B', '#FF8E53']}
                style={styles.buttonGradient}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 0 }}
              >
                {loadingRandom ? (
                  <ActivityIndicator color="#fff" />
                ) : (
                  <Text style={styles.buttonText}>🎲 Get Random Words</Text>
                )}
              </LinearGradient>
            </TouchableOpacity>

            {randomWords && (
              <View style={styles.randomWordsContainer}>
                {randomWords.english && (
                  <>
                    <Text style={styles.languageHeader}>🇬🇧 English</Text>
                    {renderWordCard(randomWords.english, 'english')}
                  </>
                )}
                {randomWords.hindi && (
                  <>
                    <Text style={styles.languageHeader}>🇮🇳 Hindi</Text>
                    {renderWordCard(randomWords.hindi, 'hindi')}
                  </>
                )}
                {randomWords.telugu && (
                  <>
                    <Text style={styles.languageHeader}>🇮🇳 Telugu</Text>
                    {renderWordCard(randomWords.telugu, 'telugu')}
                  </>
                )}
              </View>
            )}
          </View>
        </Animated.View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#4FACFE',
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
    marginBottom: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 5,
  },
  sectionLabel: {
    fontSize: 18,
    fontWeight: '600',
    color: '#333',
    marginBottom: 8,
  },
  sectionDescription: {
    fontSize: 14,
    color: '#666',
    marginBottom: 15,
  },
  input: {
    backgroundColor: '#f9f9f9',
    borderRadius: 12,
    padding: 15,
    fontSize: 16,
    borderWidth: 1,
    borderColor: '#e0e0e0',
    marginBottom: 15,
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
    marginBottom: 20,
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
    fontSize: 16,
    fontWeight: 'bold',
  },
  divider: {
    height: 2,
    backgroundColor: 'rgba(255, 255, 255, 0.3)',
    marginVertical: 20,
  },
  wordCard: {
    backgroundColor: '#f9f9f9',
    borderRadius: 12,
    padding: 15,
    marginTop: 15,
    borderWidth: 1,
    borderColor: '#e0e0e0',
  },
  wordHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 15,
  },
  wordTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
  },
  languageBadge: {
    backgroundColor: '#667eea',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 12,
  },
  languageText: {
    color: '#fff',
    fontSize: 12,
    fontWeight: '600',
    textTransform: 'capitalize',
  },
  audioButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#667eea',
    padding: 12,
    borderRadius: 10,
    marginBottom: 15,
  },
  audioButtonPlaying: {
    backgroundColor: '#FF6B6B',
  },
  audioIcon: {
    fontSize: 20,
    marginRight: 10,
  },
  audioButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  syllablesContainer: {
    marginTop: 10,
  },
  syllablesTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
    marginBottom: 10,
  },
  syllableCard: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#fff',
    padding: 12,
    borderRadius: 8,
    marginBottom: 8,
    borderWidth: 1,
    borderColor: '#e0e0e0',
  },
  syllableHeader: {
    flex: 1,
  },
  syllableText: {
    fontSize: 18,
    fontWeight: '600',
    color: '#333',
    marginBottom: 4,
  },
  exampleText: {
    fontSize: 12,
    color: '#666',
    fontStyle: 'italic',
  },
  syllableAudioButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#4FACFE',
    justifyContent: 'center',
    alignItems: 'center',
  },
  syllableAudioButtonPlaying: {
    backgroundColor: '#FF6B6B',
  },
  syllableAudioIcon: {
    fontSize: 16,
  },
  randomWordsContainer: {
    marginTop: 20,
  },
  languageHeader: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333',
    marginTop: 15,
    marginBottom: 10,
  },
  audioWarning: {
    backgroundColor: 'rgba(255, 193, 7, 0.9)',
    padding: 10,
    borderRadius: 8,
    marginTop: 10,
  },
  audioWarningText: {
    color: '#333',
    fontSize: 14,
    fontWeight: '600',
    textAlign: 'center',
  },
});
