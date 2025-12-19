import React, { useState, useEffect, useCallback } from 'react';
import { useParams, Link } from 'react-router-dom';
import Header from '../components/Header';
import { getCourse, getLessons } from '../utils/api';
import './CourseDetailPage.css';

const ActionButtons = ({ text, onListen, onTranslate, onAi }) => (
  <div className="action-buttons">
    <button className="action-btn" onClick={() => onListen(text)}>🔊 Listen</button>
    <button className="action-btn" onClick={() => onTranslate(text)}>🌐 Translate</button>
    <button className="action-btn" onClick={() => onAi(text)}>🤖 Learn With AI</button>
  </div>
);

const CourseDetailPage = () => {
  const { id } = useParams();
  const [course, setCourse] = useState(null);
  const [lessons, setLessons] = useState([]);
  const [selectedLesson, setSelectedLesson] = useState(null);
  const [loading, setLoading] = useState(true);
  const [translateModal, setTranslateModal] = useState({ open: false, text: '', result: '', loading: false, error: '' });
  const [aiModal, setAiModal] = useState({ open: false, context: '', userPrompt: '', result: '', loading: false, error: '' });

  useEffect(() => {
    const fetchCourseData = async () => {
      try {
        const [courseData, lessonsData] = await Promise.all([
          getCourse(id),
          getLessons(id)
        ]);
        setCourse(courseData);
        setLessons(lessonsData);
        if (lessonsData.length > 0) {
          setSelectedLesson(lessonsData[0]);
        }
      } catch (error) {
        console.error('Error fetching course data:', error);
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      fetchCourseData();
    }
  }, [id]);

  // Listen handler using Speech Synthesis
  const handleListen = useCallback((text) => {
    if (!text) return;
    if (!('speechSynthesis' in window)) {
      alert('Speech synthesis not supported in this browser.');
      return;
    }
    window.speechSynthesis.cancel();
    const utter = new SpeechSynthesisUtterance(text);
    utter.lang = 'en-US';
    utter.rate = 0.95;
    window.speechSynthesis.speak(utter);
  }, []);

  // Translate handler using LibreTranslate (no API key required). You can swap endpoint via env.
  const handleTranslate = useCallback(async (text) => {
    if (!text) return;
    setTranslateModal({ open: true, text, result: '', loading: true, error: '' });
    const endpoint = process.env.REACT_APP_TRANSLATE_URL || 'https://libretranslate.de/translate';
    try {
      const res = await fetch(endpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          q: text,
          source: 'en',
          target: 'hi',
          format: 'text'
        })
      });
      if (!res.ok) throw new Error('Translation failed');
      const data = await res.json();
      setTranslateModal({ open: true, text, result: data.translatedText || '', loading: false, error: '' });
    } catch (err) {
      setTranslateModal({ open: true, text, result: '', loading: false, error: 'Translation failed. Please try again.' });
    }
  }, []);

  // Simple AI stub: returns a constrained response for demo purposes (no API key).
  const handleAi = useCallback(async (contextText) => {
    setAiModal((prev) => ({ ...prev, open: true, context: contextText, result: '', error: '' }));
  }, []);

  const runAiStub = useCallback((context, prompt) => {
    if (!prompt?.trim()) {
      setAiModal((prev) => ({ ...prev, error: 'Please enter a question.', loading: false }));
      return;
    }
    // Constrained, grammar-focused, safe stubbed response
    const response = [
      'Here is a concise, grammar-focused explanation:',
      `Context: ${context.slice(0, 120)}${context.length > 120 ? '...' : ''}`,
      `Your question: ${prompt}`,
      'Guidance: Keep sentences simple; ensure subject-verb agreement; use clear examples.',
      'Example: "I am learning English." -> subject (I) + verb (am) + gerund (learning) + object (English).'
    ].join('\n');
    setAiModal((prev) => ({ ...prev, result: response, loading: false, error: '' }));
  }, []);

  if (loading) {
    return (
      <div>
        <Header />
        <div className="loading">Loading course...</div>
      </div>
    );
  }

  if (!course) {
    return (
      <div>
        <Header />
        <div className="error">Course not found</div>
      </div>
    );
  }

  return (
    <div className="course-detail-page">
      <Header />
      <div className="course-detail-container">
        <Link to="/dashboard" className="back-link">← Back to Dashboard</Link>
        
        <div className="course-header">
          <div className="course-icon">{course.image || '📚'}</div>
          <div className="course-header-content">
            <h1 className="course-title">{course.name}</h1>
            <p className="course-meta">
              <span className="course-level">{course.level}</span>
              <span className="course-language">{course.language}</span>
              <span className="course-lessons-count">{lessons.length} Lessons</span>
            </p>
            <p className="course-description">{course.description}</p>
            
            {course.lessons && course.lessons.length > 0 && (
              <div className="learning-outcomes">
                <h3>What You'll Learn</h3>
                <ul>
                  {lessons[0]?.learningOutcomes?.map((outcome, index) => (
                    <li key={index}>{outcome}</li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        </div>

        <div className="course-content-layout">
          <div className="lessons-sidebar">
            <h2 className="lessons-title">Lessons</h2>
            <div className="lessons-list">
              {lessons.map((lesson, index) => (
                <div
                  key={lesson._id}
                  className={`lesson-item ${selectedLesson?._id === lesson._id ? 'active' : ''}`}
                  onClick={() => setSelectedLesson(lesson)}
                >
                  <div className="lesson-number">{index + 1}</div>
                  <div className="lesson-info">
                    <h3 className="lesson-title">{lesson.title}</h3>
                    <p className="lesson-type">{lesson.type}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="lesson-content-area">
            {selectedLesson ? (
              <div className="lesson-detail">
                <div className="lesson-header">
                  <h2>{selectedLesson.title}</h2>
                  <ActionButtons text={selectedLesson.title} onListen={handleListen} onTranslate={handleTranslate} onAi={handleAi} />
                  <p className="lesson-description">
                    {selectedLesson.description}
                  </p>
                  <ActionButtons text={selectedLesson.description} onListen={handleListen} onTranslate={handleTranslate} onAi={handleAi} />
                </div>

                {selectedLesson.learningOutcomes && selectedLesson.learningOutcomes.length > 0 && (
                  <div className="lesson-outcomes">
                    <h3>Learning Outcomes</h3>
                    <ul>
                      {selectedLesson.learningOutcomes.map((outcome, index) => (
                        <li key={index}>
                          {outcome}
                          <ActionButtons text={outcome} onListen={handleListen} onTranslate={handleTranslate} onAi={handleAi} />
                        </li>
                      ))}
                    </ul>
                  </div>
                )}

                {selectedLesson.sections && selectedLesson.sections.length > 0 && (
                  <div className="lesson-sections">
                    {selectedLesson.sections.map((section, sectionIndex) => (
                      <div key={sectionIndex} className="lesson-section">
                        <h3 className="section-title">{section.title}</h3>
                        <ActionButtons text={section.title} onListen={handleListen} onTranslate={handleTranslate} onAi={handleAi} />
                        <p className="section-content">{section.content}</p>
                        <ActionButtons text={section.content} onListen={handleListen} onTranslate={handleTranslate} onAi={handleAi} />
                        
                        {section.examples && section.examples.length > 0 && (
                          <div className="section-examples">
                            <h4>Examples:</h4>
                            {section.examples.map((example, exampleIndex) => (
                              <div key={exampleIndex} className="example-item">
                                <div className="example-text">
                                  {example.text}
                                  <ActionButtons text={example.text} onListen={handleListen} onTranslate={handleTranslate} onAi={handleAi} />
                                </div>
                                {example.explanation && (
                                  <div className="example-explanation">
                                    {example.explanation}
                                    <ActionButtons text={example.explanation} onListen={handleListen} onTranslate={handleTranslate} onAi={handleAi} />
                                  </div>
                                )}
                              </div>
                            ))}
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                )}

                {selectedLesson.practiceExercises && selectedLesson.practiceExercises.length > 0 && (
                  <div className="practice-section">
                    <h3>Practice Exercises</h3>
                    {selectedLesson.practiceExercises.map((exercise, exerciseIndex) => (
                      <div key={exerciseIndex} className="practice-exercise">
                        <div className="exercise-question">
                          <strong>Question {exerciseIndex + 1}:</strong> {exercise.question}
                          <ActionButtons text={exercise.question} onListen={handleListen} onTranslate={handleTranslate} onAi={handleAi} />
                        </div>
                        {exercise.type === 'multiple-choice' && exercise.options && (
                          <div className="exercise-options">
                            {exercise.options.map((option, optionIndex) => (
                              <div key={optionIndex} className="option-item">
                                {String.fromCharCode(65 + optionIndex)}. {option}
                                <ActionButtons text={option} onListen={handleListen} onTranslate={handleTranslate} onAi={handleAi} />
                              </div>
                            ))}
                          </div>
                        )}
                        {exercise.explanation && (
                          <div className="exercise-explanation">
                            <strong>Answer:</strong> {exercise.explanation}
                            <ActionButtons text={exercise.explanation} onListen={handleListen} onTranslate={handleTranslate} onAi={handleAi} />
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                )}

                {selectedLesson.content && (
                  <div className="lesson-additional-content">
                    <div dangerouslySetInnerHTML={{ __html: selectedLesson.content }} />
                    <ActionButtons text={selectedLesson.content} onListen={handleListen} onTranslate={handleTranslate} onAi={handleAi} />
                  </div>
                )}
              </div>
            ) : (
              <div className="no-lesson-selected">
                <p>Select a lesson from the sidebar to view its content.</p>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Translate Modal */}
      {translateModal.open && (
        <div className="modal-backdrop" onClick={() => setTranslateModal({ open: false, text: '', result: '', loading: false, error: '' })}>
          <div className="modal" onClick={(e) => e.stopPropagation()}>
            <h3>Translate to Hindi</h3>
            <p className="modal-text">{translateModal.text}</p>
            {translateModal.loading && <p className="modal-status">Translating...</p>}
            {translateModal.error && <p className="modal-error">{translateModal.error}</p>}
            {translateModal.result && (
              <div className="modal-result">
                <strong>Hindi:</strong> {translateModal.result}
              </div>
            )}
            <div className="modal-actions">
              <button className="btn-secondary" onClick={() => setTranslateModal({ open: false, text: '', result: '', loading: false, error: '' })}>
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* AI Modal */}
      {aiModal.open && (
        <div className="modal-backdrop" onClick={() => setAiModal({ open: false, context: '', userPrompt: '', result: '', loading: false, error: '' })}>
          <div className="modal modal-wide" onClick={(e) => e.stopPropagation()}>
            <h3>Learn With AI</h3>
            <p className="modal-label">Context</p>
            <div className="modal-context">{aiModal.context}</div>
            <p className="modal-label">Ask a question or request</p>
            <textarea
              className="modal-textarea"
              rows="4"
              value={aiModal.userPrompt}
              onChange={(e) => setAiModal((prev) => ({ ...prev, userPrompt: e.target.value }))}
              placeholder="Ask AI anything about this topic..."
            />
            {aiModal.error && <p className="modal-error">{aiModal.error}</p>}
            <div className="modal-actions spaced">
              <div className="ai-prompt-suggestions">
                <button className="prompt-chip" onClick={() => setAiModal((prev) => ({ ...prev, userPrompt: 'Explain this concept again' }))}>Explain this concept again</button>
                <button className="prompt-chip" onClick={() => setAiModal((prev) => ({ ...prev, userPrompt: 'Generate more examples for me' }))}>Generate more examples</button>
                <button className="prompt-chip" onClick={() => setAiModal((prev) => ({ ...prev, userPrompt: 'Test me with a quiz' }))}>Test me with a quiz</button>
                <button className="prompt-chip" onClick={() => setAiModal((prev) => ({ ...prev, userPrompt: 'Create a practice conversation' }))}>Create a practice conversation</button>
              </div>
              <div className="ai-buttons">
                <button
                  className="btn-primary"
                  onClick={() => {
                    setAiModal((prev) => ({ ...prev, loading: true, result: '', error: '' }));
                    runAiStub(aiModal.context, aiModal.userPrompt);
                  }}
                  disabled={aiModal.loading}
                >
                  {aiModal.loading ? 'Thinking...' : 'Ask AI'}
                </button>
                <button
                  className="btn-secondary"
                  onClick={() => setAiModal({ open: false, context: '', userPrompt: '', result: '', loading: false, error: '' })}
                >
                  Close
                </button>
              </div>
            </div>
            {aiModal.result && (
              <div className="modal-result scrollable">
                <pre>{aiModal.result}</pre>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default CourseDetailPage;

