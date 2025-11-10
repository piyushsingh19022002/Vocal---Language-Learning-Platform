import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { getLesson } from '../utils/api';
import './Lesson.css';

const Lesson = () => {
  const { id } = useParams();
  const [lesson, setLesson] = useState(null);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState(null);
  const [showFeedback, setShowFeedback] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchLesson = async () => {
      try {
        const data = await getLesson(id);
        setLesson(data);
      } catch (error) {
        console.error('Error fetching lesson:', error);
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      fetchLesson();
    }
  }, [id]);

  const handleAnswerSelect = (index) => {
    setSelectedAnswer(index);
  };

  const handleSubmitAnswer = () => {
    setShowFeedback(true);
  };

  const handleContinue = () => {
    if (currentQuestion < lesson.questions.length - 1) {
      setCurrentQuestion(currentQuestion + 1);
      setSelectedAnswer(null);
      setShowFeedback(false);
    }
  };

  const progress = ((currentQuestion + 1) / (lesson?.questions.length || 1)) * 100;

  if (loading) {
    return <div className="loading">Loading lesson...</div>;
  }

  if (!lesson) {
    return <div className="error">Lesson not found</div>;
  }

  const question = lesson.questions[currentQuestion];

  return (
    <div className="lesson-page">
      <div className="lesson-container">
        <div className="lesson-header">
          <h1 className="lesson-title">{lesson.title}</h1>
          <p className="lesson-subtitle">{lesson.description}</p>
        </div>

        <div className="progress-section">
          <h3>Lesson Progress</h3>
          <div className="progress-bar-container">
            <div className="progress-bar" style={{ width: `${progress}%` }}></div>
            <span className="progress-text">{Math.round(progress)}%</span>
          </div>
        </div>

        {lesson.audioUrl && (
          <div className="audio-player">
            <div className="audio-info">
              <div className="audio-icon">🎧</div>
              <div>
                <div className="audio-title">Conversation at a Cafe</div>
                <div className="audio-subtitle">Lesson 3 Audio</div>
              </div>
            </div>
            <div className="audio-controls">
              <div className="audio-time">1:17 / 2:23</div>
              <button
                className="play-button"
                onClick={() => setIsPlaying(!isPlaying)}
              >
                {isPlaying ? '⏸' : '▶'}
              </button>
            </div>
          </div>
        )}

        <div className="question-section">
          <h3 className="question-number">
            Question {currentQuestion + 1} of {lesson.questions.length}
          </h3>
          <div className="question-card">
            <h4 className="question-text">{question.question}</h4>
            <div className="options">
              {question.options.map((option, index) => (
                <label
                  key={index}
                  className={`option ${
                    selectedAnswer === index ? 'selected' : ''
                  } ${
                    showFeedback
                      ? index === question.correctAnswer
                        ? 'correct'
                        : selectedAnswer === index && index !== question.correctAnswer
                        ? 'incorrect'
                        : ''
                      : ''
                  }`}
                >
                  <input
                    type="radio"
                    name="answer"
                    value={index}
                    checked={selectedAnswer === index}
                    onChange={() => handleAnswerSelect(index)}
                    disabled={showFeedback}
                  />
                  <span>{option}</span>
                </label>
              ))}
            </div>
          </div>

          {showFeedback && (
            <div className="feedback-section">
              <div
                className={`feedback ${
                  selectedAnswer === question.correctAnswer ? 'correct' : 'incorrect'
                }`}
              >
                {selectedAnswer === question.correctAnswer ? (
                  <>
                    <span className="feedback-icon">✓</span>
                    <span>Correct!</span>
                  </>
                ) : (
                  <>
                    <span className="feedback-icon">✗</span>
                    <span>Incorrect. The correct answer is: {question.options[question.correctAnswer]}</span>
                  </>
                )}
              </div>
              {question.explanation && (
                <p className="explanation">{question.explanation}</p>
              )}
              <button className="btn-continue" onClick={handleContinue}>
                Continue
              </button>
            </div>
          )}

          {!showFeedback && selectedAnswer !== null && (
            <button className="btn-submit" onClick={handleSubmitAnswer}>
              Submit Answer
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default Lesson;

