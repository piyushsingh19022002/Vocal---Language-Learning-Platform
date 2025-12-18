import React, { useState } from 'react';
import { speakText, generateSummary, extractVocabulary } from '../../utils/textTools';
import SummaryBox from './SummaryBox';
import VocabularyBox from './VocabularyBox';
import WordTranslator from './WordTranslator';
import './TTSPracticePanel.css';

const TTSPracticePanel = ({ textLanguage, listeningLanguage, user, onPracticeComplete }) => {
  const [text, setText] = useState('');
  const [summary, setSummary] = useState('');
  const [vocab, setVocab] = useState([]);
  const [error, setError] = useState('');
  const [speaking, setSpeaking] = useState(false);
  const [playedText, setPlayedText] = useState('');
  const [selectedWord, setSelectedWord] = useState('');
  const [showTranslator, setShowTranslator] = useState(false);
  const [playbackRate, setPlaybackRate] = useState(1);
  const [savedPractices, setSavedPractices] = useState([]);

  // Load saved practices from localStorage
  React.useEffect(() => {
    const saved = localStorage.getItem('savedPractices');
    if (saved) {
      try {
        setSavedPractices(JSON.parse(saved));
      } catch (e) {
        console.error('Error loading saved practices:', e);
      }
    }
  }, []);

  const handleSpeak = () => {
    if (!text.trim()) {
      setError('Please enter text to convert.');
      return;
    }

    setError('');
    setSpeaking(true);

    try {
      // Generate summary and vocabulary
      const summaryText = generateSummary(text);
      const vocabList = extractVocabulary(text);

      // Use listeningLanguage for TTS (not textLanguage)
      speakText(text, listeningLanguage, () => {
        setSpeaking(false);
        setPlayedText(text);
        setSummary(summaryText);
        setVocab(vocabList);
        
        // Track practice completion
        if (onPracticeComplete) {
          onPracticeComplete();
        }

        // Update TTS usage count in localStorage
        const ttsCount = parseInt(localStorage.getItem('ttsUsageCount') || '0') + 1;
        localStorage.setItem('ttsUsageCount', ttsCount.toString());
      });
    } catch (err) {
      console.error(err);
      setError(err.message || 'Speech synthesis failed.');
      setSpeaking(false);
    }
  };

  const handleSavePractice = () => {
    if (!text.trim()) return;

    const practice = {
      id: Date.now(),
      text,
      textLanguage,
      listeningLanguage,
      summary,
      vocab,
      createdAt: new Date().toISOString(),
    };

    const updated = [practice, ...savedPractices].slice(0, 10); // Keep last 10
    setSavedPractices(updated);
    localStorage.setItem('savedPractices', JSON.stringify(updated));
  };

  const handleLoadPractice = (practice) => {
    setText(practice.text);
    setSummary(practice.summary || '');
    setVocab(practice.vocab || []);
    setPlayedText(practice.text);
  };

  const handleWordClick = (word) => {
    if (!word.trim()) return;
    setSelectedWord(word);
    setShowTranslator(true);
  };

  const renderClickableText = () => {
    if (!playedText) return null;
    
    return playedText.split(/(\s+)/).map((part, index) => {
      if (!part.trim()) return part;
      const wordMatch = part.match(/[A-Za-zÀ-ÿ0-9'-]+/);
      if (!wordMatch) return part;
      const cleanWord = wordMatch[0];
      return (
        <span
          key={`${cleanWord}-${index}`}
          className={`clickable-word ${selectedWord === cleanWord ? 'active' : ''}`}
          onClick={() => handleWordClick(cleanWord)}
        >
          {part}
        </span>
      );
    });
  };

  return (
    <div className="tts-practice-panel">
      <div className="tts-practice-card">
        <div className="tts-header">
          <h3 className="tts-title">Text-to-Speech Practice</h3>
          <p className="tts-subtitle">
            Enter text in <strong>{textLanguage}</strong> and listen in <strong>{listeningLanguage}</strong>
          </p>
        </div>

        {/* Text Input */}
        <div className="tts-input-section">
          <textarea
            value={text}
            onChange={(e) => setText(e.target.value)}
            placeholder="Type or paste your text here..."
            rows={8}
            className="tts-textarea"
          />
          
          <div className="tts-controls">
            <button
              className="tts-speak-btn"
              onClick={handleSpeak}
              disabled={speaking || !text.trim()}
            >
              {speaking ? '🔊 Speaking...' : '▶️ Convert to Audio'}
            </button>

            {text.trim() && (
              <button
                className="tts-save-btn"
                onClick={handleSavePractice}
                title="Save this practice"
              >
                💾 Save Practice
              </button>
            )}
          </div>

          {/* Speed Control */}
          {speaking && (
            <div className="tts-speed-controls">
              <label>Speed:</label>
              {[0.5, 0.75, 1, 1.25, 1.5, 2].map((rate) => (
                <button
                  key={rate}
                  className={`speed-btn ${playbackRate === rate ? 'active' : ''}`}
                  onClick={() => {
                    setPlaybackRate(rate);
                    // Note: Browser TTS doesn't support rate control directly
                    // This is for UI consistency
                  }}
                >
                  {rate}x
                </button>
              ))}
            </div>
          )}

          {error && <div className="tts-error">{error}</div>}
        </div>

        {/* Played Text with Clickable Words */}
        {playedText && (
          <div className="played-text-section">
            <div className="played-text-header">
              <span className="header-text">Tap a word to translate</span>
              <span className="header-lang">
                Source: {textLanguage.split('-')[0].toUpperCase()}
              </span>
            </div>
            <div className="played-text-content">
              {renderClickableText()}
            </div>
            {showTranslator && selectedWord && (
              <WordTranslator
                word={selectedWord}
                sourceLang={textLanguage.split('-')[0]}
                onClose={() => setShowTranslator(false)}
              />
            )}
          </div>
        )}

        {/* Summary and Vocabulary */}
        {summary && <SummaryBox summary={summary} />}
        {vocab && vocab.length > 0 && <VocabularyBox words={vocab} />}
      </div>

      {/* Saved Practices */}
      {savedPractices.length > 0 && (
        <div className="saved-practices-section">
          <h4 className="saved-practices-title">💾 Saved Practices</h4>
          <div className="saved-practices-list">
            {savedPractices.map((practice) => (
              <div
                key={practice.id}
                className="saved-practice-item"
                onClick={() => handleLoadPractice(practice)}
              >
                <div className="saved-practice-text">
                  {practice.text.substring(0, 100)}
                  {practice.text.length > 100 ? '...' : ''}
                </div>
                <div className="saved-practice-meta">
                  {practice.listeningLanguage} • {new Date(practice.createdAt).toLocaleDateString()}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default TTSPracticePanel;

