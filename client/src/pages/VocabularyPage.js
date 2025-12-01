import React, { useState, useEffect } from 'react';
import Header from '../components/Header';
import Vocabulary from '../components/Vocabulary';
import { getVocabulary, createVocabulary, parseSentence, getCurrentUser } from '../utils/api';
import './VocabularyPage.css';

const VocabularyPage = () => {
  const [inputText, setInputText] = useState('');
  const [inputType, setInputType] = useState('word'); // 'word' or 'sentence'
  const [language, setLanguage] = useState('French');
  const [vocabulary, setVocabulary] = useState([]);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [user, setUser] = useState(null);
  const [previewWords, setPreviewWords] = useState([]);

  useEffect(() => {
    fetchUser();
    fetchVocabulary();
  }, [language]);

  const fetchUser = async () => {
    try {
      const userData = await getCurrentUser();
      setUser(userData);
    } catch (error) {
      console.error('Error fetching user:', error);
    }
  };

  const fetchVocabulary = async () => {
    try {
      setLoading(true);
      const data = await getVocabulary({ language });
      setVocabulary(data);
      setMessage(''); // Clear any previous error messages
    } catch (error) {
      console.error('Error fetching vocabulary:', error);
      const errorMessage = error.response?.data?.message || 
                          error.message || 
                          'Error loading vocabulary. Please check your connection.';
      setMessage(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const handleParseSentence = async () => {
    if (!inputText.trim()) {
      setMessage('Please enter a sentence');
      return;
    }

    try {
      setLoading(true);
      const result = await parseSentence(inputText, language);
      setPreviewWords(result.words);
      setMessage(`Found ${result.wordCount} words in the sentence`);
    } catch (error) {
      console.error('Error parsing sentence:', error);
      setMessage('Error parsing sentence');
    } finally {
      setLoading(false);
    }
  };

  const handleAddWord = async () => {
    if (!inputText.trim()) {
      setMessage('Please enter a word');
      return;
    }

    try {
      setLoading(true);
      setMessage('');
      
      if (inputType === 'sentence') {
        const result = await createVocabulary({
          sentence: inputText,
          language
        });
        setMessage(result.message || `Added ${result.vocabulary?.length || 0} words`);
        setInputText('');
        setPreviewWords([]);
      } else {
        await createVocabulary({
          word: inputText.trim(),
          language,
          translation: '',
          difficulty: 'New'
        });
        setMessage('Word added successfully!');
        setInputText('');
      }
      
      await fetchVocabulary();
    } catch (error) {
      console.error('Error adding vocabulary:', error);
      const errorMessage = error.response?.data?.message || 
                          error.message || 
                          'Error adding vocabulary. Please check your connection and try again.';
      setMessage(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const handleAddPreviewWords = async () => {
    if (previewWords.length === 0) return;

    try {
      setLoading(true);
      const result = await createVocabulary({
        sentence: inputText,
        language
      });
      setMessage(result.message || `Added ${result.vocabulary?.length || 0} words`);
      setInputText('');
      setPreviewWords([]);
      await fetchVocabulary();
    } catch (error) {
      console.error('Error adding words:', error);
      const errorMessage = error.response?.data?.message || 
                          error.message || 
                          'Error adding words. Please check your connection and try again.';
      setMessage(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="vocabulary-page-wrapper">
      <Header />
      <div className="vocabulary-page">
        <div className="vocabulary-page-container">
          <div className="vocabulary-input-section">
            <h1 className="page-title">My Vocabulary Builder</h1>
            <p className="page-subtitle">
              Add words or sentences to build your personal vocabulary list
            </p>

            <div className="input-type-selector">
              <button
                className={`type-btn ${inputType === 'word' ? 'active' : ''}`}
                onClick={() => {
                  setInputType('word');
                  setPreviewWords([]);
                  setMessage('');
                }}
              >
                📝 Single Word
              </button>
              <button
                className={`type-btn ${inputType === 'sentence' ? 'active' : ''}`}
                onClick={() => {
                  setInputType('sentence');
                  setPreviewWords([]);
                  setMessage('');
                }}
              >
                📄 Sentence
              </button>
            </div>

            <div className="language-selector">
              <label>Language:</label>
              <select
                value={language}
                onChange={(e) => setLanguage(e.target.value)}
                className="language-select"
              >
                <option value="French">French</option>
                <option value="Spanish">Spanish</option>
                <option value="German">German</option>
                <option value="Italian">Italian</option>
                <option value="English">English</option>
              </select>
            </div>

            <div className="input-container">
              <textarea
                className="vocabulary-input"
                placeholder={
                  inputType === 'word'
                    ? 'Enter a word...'
                    : 'Enter a sentence (e.g., "Bonjour, comment allez-vous?")'
                }
                value={inputText}
                onChange={(e) => setInputText(e.target.value)}
                rows={inputType === 'sentence' ? 3 : 1}
              />
              
              {inputType === 'sentence' && (
                <button
                  className="btn-parse"
                  onClick={handleParseSentence}
                  disabled={loading || !inputText.trim()}
                >
                  🔍 Preview Words
                </button>
              )}

              {previewWords.length > 0 && (
                <div className="preview-section">
                  <h3>Words found ({previewWords.length}):</h3>
                  <div className="preview-words">
                    {previewWords.map((wordObj, index) => (
                      <span key={index} className="preview-word">
                        {wordObj.word}
                      </span>
                    ))}
                  </div>
                  <button
                    className="btn-add-preview"
                    onClick={handleAddPreviewWords}
                    disabled={loading}
                  >
                    ✅ Add All Words
                  </button>
                </div>
              )}

              <button
                className="btn-add-vocabulary"
                onClick={handleAddWord}
                disabled={loading || !inputText.trim()}
              >
                {loading ? 'Adding...' : inputType === 'word' ? '➕ Add Word' : '➕ Add Sentence'}
              </button>

              {message && (
                <div className={`message ${message.includes('Error') ? 'error' : 'success'}`}>
                  {message}
                </div>
              )}
            </div>
          </div>

          <div className="vocabulary-display-section">
            <Vocabulary 
              language={language} 
              vocabulary={vocabulary}
              onVocabularyUpdate={fetchVocabulary}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default VocabularyPage;

