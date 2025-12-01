import React, { useState, useEffect } from 'react';
import { getVocabulary, deleteVocabulary, updateVocabulary } from '../utils/api';
import './Vocabulary.css';

const Vocabulary = ({ language = 'French', unit = 'Unit 3', vocabulary: propVocabulary, onVocabularyUpdate }) => {
  const [vocabulary, setVocabulary] = useState(propVocabulary || []);
  const [filter, setFilter] = useState('All');
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(!propVocabulary);
  const [practicingWord, setPracticingWord] = useState(null);
  const [recognitionResult, setRecognitionResult] = useState(null);
  const [isListening, setIsListening] = useState(false);

  useEffect(() => {
    if (propVocabulary) {
      setVocabulary(propVocabulary);
      setLoading(false);
    } else {
      fetchVocabulary();
    }
  }, [propVocabulary, language, unit, filter]);

  const fetchVocabulary = async () => {
    try {
      setLoading(true);
      const filters = {
        language,
        ...(unit && { unit }),
        ...(filter === 'New Words' && { difficulty: 'New' }),
        ...(filter === 'Difficult Words' && { difficulty: 'Difficult' }),
        ...(filter === 'Learned Words' && { difficulty: 'Learned' }),
      };
      const data = await getVocabulary(filters);
      setVocabulary(data);
    } catch (error) {
      console.error('Error fetching vocabulary:', error);
    } finally {
      setLoading(false);
    }
  };

  const filteredVocabulary = vocabulary.filter((word) => {
    // Filter by difficulty
    if (filter === 'New Words' && word.difficulty !== 'New') return false;
    if (filter === 'Difficult Words' && word.difficulty !== 'Difficult') return false;
    if (filter === 'Learned Words' && word.difficulty !== 'Learned') return false;
    
    // Filter by search term
    if (searchTerm) {
      const searchLower = searchTerm.toLowerCase();
      const wordMatch = word.word?.toLowerCase().includes(searchLower);
      const translationMatch = word.translation?.toLowerCase().includes(searchLower);
      if (!wordMatch && !translationMatch) return false;
    }
    
    return true;
  });

  const newWordsCount = vocabulary.filter((w) => w.difficulty === 'New').length;
  const difficultWordsCount = vocabulary.filter((w) => w.difficulty === 'Difficult').length;
  const learnedWordsCount = vocabulary.filter((w) => w.difficulty === 'Learned').length;
  const totalWords = vocabulary.length;
  const learnedProgress = totalWords > 0 ? (learnedWordsCount / totalWords) * 100 : 0;

  const playAudio = (audioUrl) => {
    if (audioUrl) {
      const audio = new Audio(audioUrl);
      audio.play();
    }
  };

  // Pronunciation function using Web Speech API
  const speakWord = (word, lang = language) => {
    if ('speechSynthesis' in window) {
      // Stop any ongoing speech
      window.speechSynthesis.cancel();
      
      // Map language names to language codes
      const languageMap = {
        'French': 'fr-FR',
        'Spanish': 'es-ES',
        'German': 'de-DE',
        'Italian': 'it-IT',
        'English': 'en-US'
      };
      
      const langCode = languageMap[lang] || 'en-US';
      
      const utterance = new SpeechSynthesisUtterance(word);
      utterance.lang = langCode;
      utterance.rate = 0.9; // Slightly slower for clarity
      utterance.pitch = 1;
      utterance.volume = 1;
      
      // Try to find a voice that matches the language
      const voices = window.speechSynthesis.getVoices();
      const preferredVoice = voices.find(voice => 
        voice.lang.startsWith(langCode.split('-')[0])
      );
      
      if (preferredVoice) {
        utterance.voice = preferredVoice;
      }
      
      window.speechSynthesis.speak(utterance);
    } else {
      alert('Speech synthesis is not supported in your browser');
    }
  };

  // Load voices when component mounts
  useEffect(() => {
    if ('speechSynthesis' in window) {
      // Chrome loads voices asynchronously
      const loadVoices = () => {
        window.speechSynthesis.getVoices();
      };
      loadVoices();
      if (window.speechSynthesis.onvoiceschanged !== undefined) {
        window.speechSynthesis.onvoiceschanged = loadVoices;
      }
    }
  }, []);

  // Check if speech recognition is available and get the constructor
  const getSpeechRecognition = () => {
    if ('webkitSpeechRecognition' in window) {
      return window.webkitSpeechRecognition;
    } else if ('SpeechRecognition' in window) {
      return window.SpeechRecognition;
    }
    return null;
  };

  // Calculate similarity between two strings (Levenshtein distance based)
  const calculateSimilarity = (str1, str2) => {
    const s1 = str1.toLowerCase().trim();
    const s2 = str2.toLowerCase().trim();
    
    if (s1 === s2) return 100;
    
    // Exact match after normalization
    if (s1.replace(/[.,!?;:]/g, '') === s2.replace(/[.,!?;:]/g, '')) {
      return 95;
    }
    
    // Check if one contains the other
    if (s1.includes(s2) || s2.includes(s1)) {
      return 80;
    }
    
    // Calculate Levenshtein distance
    const len1 = s1.length;
    const len2 = s2.length;
    const matrix = [];
    
    for (let i = 0; i <= len2; i++) {
      matrix[i] = [i];
    }
    
    for (let j = 0; j <= len1; j++) {
      matrix[0][j] = j;
    }
    
    for (let i = 1; i <= len2; i++) {
      for (let j = 1; j <= len1; j++) {
        if (s2.charAt(i - 1) === s1.charAt(j - 1)) {
          matrix[i][j] = matrix[i - 1][j - 1];
        } else {
          matrix[i][j] = Math.min(
            matrix[i - 1][j - 1] + 1,
            matrix[i][j - 1] + 1,
            matrix[i - 1][j] + 1
          );
        }
      }
    }
    
    const distance = matrix[len2][len1];
    const maxLen = Math.max(len1, len2);
    const similarity = ((maxLen - distance) / maxLen) * 100;
    
    return Math.max(0, Math.round(similarity));
  };

  // Practice pronunciation with speech recognition
  const practicePronunciation = (wordObj, wordLanguage = language) => {
    const RecognitionClass = getSpeechRecognition();
    
    if (!RecognitionClass) {
      alert('Speech recognition is not supported in your browser. Please use Chrome, Edge, or Safari.');
      return;
    }

    setPracticingWord(wordObj._id);
    setIsListening(true);
    setRecognitionResult(null);

    // Map language names to language codes
    const languageMap = {
      'French': 'fr-FR',
      'Spanish': 'es-ES',
      'German': 'de-DE',
      'Italian': 'it-IT',
      'English': 'en-US'
    };

    const recognition = new RecognitionClass();
    recognition.lang = languageMap[wordLanguage] || 'en-US';
    recognition.continuous = false;
    recognition.interimResults = false;
    recognition.maxAlternatives = 1;

    recognition.onstart = () => {
      setIsListening(true);
    };

    recognition.onresult = (event) => {
      const spokenText = event.results[0][0].transcript.trim();
      const expectedWord = wordObj.word.trim();
      const similarity = calculateSimilarity(spokenText, expectedWord);
      
      let result = {
        spoken: spokenText,
        expected: expectedWord,
        similarity: similarity,
        isCorrect: similarity >= 80,
        isClose: similarity >= 60 && similarity < 80
      };
      
      setRecognitionResult(result);
      setIsListening(false);
      
      // Auto-update difficulty if correct
      if (result.isCorrect && wordObj.difficulty === 'New') {
        handleDifficultyChange(wordObj._id, 'Learned');
      }
    };

    recognition.onerror = (event) => {
      setIsListening(false);
      setPracticingWord(null);
      
      let errorMessage = 'Speech recognition error: ';
      switch (event.error) {
        case 'no-speech':
          errorMessage = 'No speech detected. Please try again.';
          break;
        case 'audio-capture':
          errorMessage = 'No microphone found. Please check your microphone.';
          break;
        case 'not-allowed':
          errorMessage = 'Microphone permission denied. Please allow microphone access.';
          break;
        case 'network':
          errorMessage = 'Network error. Please check your connection.';
          break;
        default:
          errorMessage = `Error: ${event.error}`;
      }
      
      setRecognitionResult({
        error: errorMessage,
        isError: true
      });
    };

    recognition.onend = () => {
      setIsListening(false);
      // Clear feedback after 5 seconds if no result was set
      setTimeout(() => {
        setRecognitionResult(prev => {
          if (prev && !prev.isError) {
            // Keep correct/incorrect results visible longer
            return prev;
          }
          return null;
        });
        if (!recognitionResult || recognitionResult?.isError) {
          setPracticingWord(null);
        }
      }, 5000);
    };

    try {
      recognition.start();
    } catch (error) {
      setIsListening(false);
      setPracticingWord(null);
      setRecognitionResult({
        error: 'Failed to start speech recognition. Please try again.',
        isError: true
      });
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this word?')) {
      return;
    }

    try {
      await deleteVocabulary(id);
      const updatedVocabulary = vocabulary.filter(item => item._id !== id);
      setVocabulary(updatedVocabulary);
      if (onVocabularyUpdate) {
        onVocabularyUpdate();
      }
    } catch (error) {
      console.error('Error deleting vocabulary:', error);
      alert('Error deleting word');
    }
  };

  const handleDifficultyChange = async (id, newDifficulty) => {
    try {
      await updateVocabulary(id, { difficulty: newDifficulty });
      const updatedVocabulary = vocabulary.map(item =>
        item._id === id ? { ...item, difficulty: newDifficulty } : item
      );
      setVocabulary(updatedVocabulary);
    } catch (error) {
      console.error('Error updating vocabulary:', error);
    }
  };

  if (loading) {
    return <div className="loading">Loading vocabulary...</div>;
  }

  return (
    <div className="vocabulary-page">
      <div className="vocabulary-container">
        <div className="vocabulary-header">
          <h1 className="vocabulary-title">
            {unit ? `My Vocabulary: ${language} ${unit}` : `My Vocabulary: ${language}`}
          </h1>
          <div className="progress-info">
            <div className="progress-bar-container">
              <div
                className="progress-bar"
                style={{ width: `${learnedProgress}%` }}
              ></div>
            </div>
            <p className="progress-text">
              You've learned {learnedWordsCount} of {totalWords} words
            </p>
          </div>
        </div>

        <div className="search-bar">
          <input
            type="text"
            placeholder="Find a word or sentence..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="search-input"
          />
        </div>

        <div className="filter-tabs">
          <button
            className={`tab ${filter === 'All' ? 'active' : ''}`}
            onClick={() => setFilter('All')}
          >
            All Words ({totalWords})
          </button>
          <button
            className={`tab ${filter === 'New Words' ? 'active' : ''}`}
            onClick={() => setFilter('New Words')}
          >
            New Words ({newWordsCount})
          </button>
          <button
            className={`tab ${filter === 'Difficult Words' ? 'active' : ''}`}
            onClick={() => setFilter('Difficult Words')}
          >
            Difficult Words ({difficultWordsCount})
          </button>
          <button
            className={`tab ${filter === 'Learned Words' ? 'active' : ''}`}
            onClick={() => setFilter('Learned Words')}
          >
            Learned Words ({learnedWordsCount})
          </button>
        </div>

        <div className="vocabulary-grid">
          {filteredVocabulary.map((word) => (
            <div key={word._id} className="vocabulary-card">
              {word.image && (
                <div className="vocabulary-image">
                  <img src={word.image} alt={word.word} />
                </div>
              )}
              <div className="vocabulary-content">
                <div className="vocabulary-header-card">
                  <h3 className="vocabulary-word">{word.word}</h3>
                  <button
                    className="delete-button"
                    onClick={() => handleDelete(word._id)}
                    title="Delete word"
                  >
                    ✕
                  </button>
                </div>
                {word.translation && (
                  <p className="vocabulary-translation">{word.translation}</p>
                )}
                
                {/* Speech Recognition Feedback */}
                {practicingWord === word._id && recognitionResult && (
                  <div className={`recognition-feedback ${recognitionResult.isError ? 'error' : recognitionResult.isCorrect ? 'correct' : recognitionResult.isClose ? 'close' : 'incorrect'}`}>
                    {recognitionResult.isError ? (
                      <p className="feedback-message">❌ {recognitionResult.error}</p>
                    ) : (
                      <>
                        <p className="feedback-message">
                          {recognitionResult.isCorrect ? '✅ Correct!' : recognitionResult.isClose ? '⚠️ Close!' : '❌ Incorrect'}
                        </p>
                        <p className="feedback-details">
                          You said: <strong>"{recognitionResult.spoken}"</strong>
                        </p>
                        <p className="feedback-similarity">
                          Similarity: {recognitionResult.similarity}%
                        </p>
                      </>
                    )}
                  </div>
                )}
                
                <div className="vocabulary-actions">
                  <button
                    className="pronounce-button"
                    onClick={() => speakWord(word.word, word.language || language)}
                    title="Pronounce word"
                  >
                    🔊
                  </button>
                  <button
                    className={`practice-button ${practicingWord === word._id && isListening ? 'listening' : ''}`}
                    onClick={() => practicePronunciation(word, word.language || language)}
                    disabled={isListening && practicingWord === word._id}
                    title="Practice pronunciation"
                  >
                    {practicingWord === word._id && isListening ? '🎤 Listening...' : '🎤'}
                  </button>
                  {word.audioUrl && (
                    <button
                      className="audio-button"
                      onClick={() => playAudio(word.audioUrl)}
                      title="Play audio file"
                    >
                      🎵
                    </button>
                  )}
                  <select
                    className="difficulty-select"
                    value={word.difficulty || 'New'}
                    onChange={(e) => handleDifficultyChange(word._id, e.target.value)}
                    title="Change difficulty"
                  >
                    <option value="New">New</option>
                    <option value="Difficult">Difficult</option>
                    <option value="Learned">Learned</option>
                  </select>
                </div>
              </div>
            </div>
          ))}
        </div>

        {filteredVocabulary.length === 0 && (
          <div className="no-results">
            {vocabulary.length === 0 
              ? 'No vocabulary words yet. Start adding words or sentences above!'
              : 'No vocabulary words found. Try adjusting your search or filter.'}
          </div>
        )}
      </div>
    </div>
  );
};

export default Vocabulary;

