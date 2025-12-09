import React, { useState, useEffect } from 'react';
import { getVocabulary } from '../utils/api';
import './Vocabulary.css';

const Vocabulary = ({ language = 'French', unit = 'Unit 3' }) => {
  const [vocabulary, setVocabulary] = useState([]);
  const [filter, setFilter] = useState('New Words');
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchVocabulary = async () => {
      try {
        const filters = {
          language,
          unit,
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

    fetchVocabulary();
  }, [language, unit, filter]);

  const filteredVocabulary = vocabulary.filter((word) =>
    word.word.toLowerCase().includes(searchTerm.toLowerCase()) ||
    word.translation.toLowerCase().includes(searchTerm.toLowerCase())
  );

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

  if (loading) {
    return <div className="loading">Loading vocabulary...</div>;
  }

  return (
    <div className="vocabulary-page">
      <div className="vocabulary-container">
        <div className="vocabulary-header">
          <h1 className="vocabulary-title">
            My Vocabulary: {language} {unit}
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
            placeholder="Find a word..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="search-input"
          />
        </div>

        <div className="filter-tabs">
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
                <h3 className="vocabulary-word">{word.word}</h3>
                <p className="vocabulary-translation">{word.translation}</p>
                <button
                  className="audio-button"
                  onClick={() => playAudio(word.audioUrl)}
                >
                  🔊
                </button>
              </div>
            </div>
          ))}
        </div>

        {filteredVocabulary.length === 0 && (
          <div className="no-results">
            No vocabulary words found. Try adjusting your search or filter.
          </div>
        )}
      </div>
    </div>
  );
};

export default Vocabulary;

