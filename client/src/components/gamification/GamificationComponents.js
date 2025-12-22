import React from 'react';
import './GamificationComponents.css';

// Level Progress Bar Component
export const LevelProgressBar = ({ level, xp, xpToNext }) => {
    const percentage = xpToNext > 0 ? Math.min((xp / (xp + xpToNext)) * 100, 100) : 0;

    return (
        <div className="level-progress-bar">
            <div className="level-info">
                <div className="level-badge">
                    <span className="level-icon">🏆</span>
                    <span className="level-text">Level {level}</span>
                </div>
                <div className="xp-text">
                    {xp.toLocaleString()} / {(xp + xpToNext).toLocaleString()} XP
                </div>
            </div>
            <div className="progress-bar-container">
                <div
                    className="progress-bar-fill level-fill"
                    style={{ width: `${percentage}%` }}
                >
                    <span className="progress-percentage">{Math.round(percentage)}%</span>
                </div>
            </div>
            <div className="xp-to-next">
                {xpToNext.toLocaleString()} XP to Level {level + 1}
            </div>
        </div>
    );
};

// Star Rating Component
export const StarRating = ({ stars, maxStars = 5 }) => {
    return (
        <div className="star-rating">
            {[...Array(maxStars)].map((_, index) => (
                <span
                    key={index}
                    className={`star ${index < stars ? 'filled' : 'empty'}`}
                >
                    {index < stars ? '⭐' : '☆'}
                </span>
            ))}
        </div>
    );
};

// Streak Counter Component
export const StreakCounter = ({ current, longest }) => {
    return (
        <div className="streak-counter">
            <div className="streak-item current-streak">
                <span className="streak-icon">🔥</span>
                <div className="streak-info">
                    <div className="streak-number">{current}</div>
                    <div className="streak-label">Day Streak</div>
                </div>
            </div>
            {longest > 0 && (
                <div className="streak-item longest-streak">
                    <span className="streak-icon">🏅</span>
                    <div className="streak-info">
                        <div className="streak-number">{longest}</div>
                        <div className="streak-label">Best Streak</div>
                    </div>
                </div>
            )}
        </div>
    );
};

// Activity Stats Grid Component
export const ActivityStatsGrid = ({ speaking, listening, vocabulary }) => {
    const formatTime = (seconds) => {
        const hours = Math.floor(seconds / 3600);
        const minutes = Math.floor((seconds % 3600) / 60);
        if (hours > 0) return `${hours}h ${minutes}m`;
        return `${minutes}m`;
    };

    return (
        <div className="activity-stats-grid">
            <div className="activity-stat-card speaking">
                <div className="stat-icon">📢</div>
                <div className="stat-content">
                    <h4>Speaking</h4>
                    <StarRating stars={speaking.stars || 0} />
                    <div className="stat-details">
                        <div className="stat-item">
                            <span className="stat-value">{speaking.sessions || 0}</span>
                            <span className="stat-label">Sessions</span>
                        </div>
                        <div className="stat-item">
                            <span className="stat-value">{formatTime(speaking.totalTime || 0)}</span>
                            <span className="stat-label">Time</span>
                        </div>
                    </div>
                    <div className="xp-earned">+{speaking.xpEarned || 0} XP</div>
                </div>
            </div>

            <div className="activity-stat-card listening">
                <div className="stat-icon">🎧</div>
                <div className="stat-content">
                    <h4>Listening</h4>
                    <StarRating stars={listening.stars || 0} />
                    <div className="stat-details">
                        <div className="stat-item">
                            <span className="stat-value">{listening.lessonsCompleted || 0}</span>
                            <span className="stat-label">Lessons</span>
                        </div>
                        <div className="stat-item">
                            <span className="stat-value">{formatTime(listening.totalTime || 0)}</span>
                            <span className="stat-label">Time</span>
                        </div>
                    </div>
                    <div className="xp-earned">+{listening.xpEarned || 0} XP</div>
                </div>
            </div>

            <div className="activity-stat-card vocabulary">
                <div className="stat-icon">📚</div>
                <div className="stat-content">
                    <h4>Vocabulary</h4>
                    <StarRating stars={vocabulary.stars || 0} />
                    <div className="stat-details">
                        <div className="stat-item">
                            <span className="stat-value">{vocabulary.wordsLearned || 0}</span>
                            <span className="stat-label">Words</span>
                        </div>
                        <div className="stat-item">
                            <span className="stat-value">{vocabulary.mastery || 0}%</span>
                            <span className="stat-label">Mastery</span>
                        </div>
                    </div>
                    <div className="xp-earned">+{vocabulary.xpEarned || 0} XP</div>
                </div>
            </div>
        </div>
    );
};

// Week Calendar Component
export const WeekCalendar = ({ days }) => {
    const dayNames = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

    return (
        <div className="week-calendar">
            {days.map((day, index) => {
                const date = new Date(day.date);
                const dayName = dayNames[date.getDay()];

                return (
                    <div
                        key={index}
                        className={`calendar-day ${day.completed ? 'completed' : 'incomplete'}`}
                    >
                        <div className="day-name">{dayName}</div>
                        <div className="day-indicator">
                            {day.completed ? '✅' : '⬜'}
                        </div>
                        <div className="day-number">{date.getDate()}</div>
                    </div>
                );
            })}
        </div>
    );
};

// Activity Breakdown Component
export const ActivityBreakdown = ({ breakdown }) => {
    return (
        <div className="activity-breakdown">
            <div className="breakdown-item">
                <div className="breakdown-header">
                    <span className="breakdown-icon">📢</span>
                    <span className="breakdown-label">Speaking</span>
                    <span className="breakdown-value">{breakdown.speaking?.sessions || 0} sessions</span>
                </div>
                <div className="breakdown-bar-container">
                    <div
                        className="breakdown-bar speaking-bar"
                        style={{ width: `${breakdown.speaking?.percentage || 0}%` }}
                    >
                        <span className="breakdown-percentage">{breakdown.speaking?.percentage || 0}%</span>
                    </div>
                </div>
            </div>

            <div className="breakdown-item">
                <div className="breakdown-header">
                    <span className="breakdown-icon">🎧</span>
                    <span className="breakdown-label">Listening</span>
                    <span className="breakdown-value">{breakdown.listening?.lessons || 0} lessons</span>
                </div>
                <div className="breakdown-bar-container">
                    <div
                        className="breakdown-bar listening-bar"
                        style={{ width: `${breakdown.listening?.percentage || 0}%` }}
                    >
                        <span className="breakdown-percentage">{breakdown.listening?.percentage || 0}%</span>
                    </div>
                </div>
            </div>

            <div className="breakdown-item">
                <div className="breakdown-header">
                    <span className="breakdown-icon">📚</span>
                    <span className="breakdown-label">Vocabulary</span>
                    <span className="breakdown-value">{breakdown.vocabulary?.reviews || 0} reviews</span>
                </div>
                <div className="breakdown-bar-container">
                    <div
                        className="breakdown-bar vocabulary-bar"
                        style={{ width: `${breakdown.vocabulary?.percentage || 0}%` }}
                    >
                        <span className="breakdown-percentage">{breakdown.vocabulary?.percentage || 0}%</span>
                    </div>
                </div>
            </div>
        </div>
    );
};

// Achievement Badge Component
export const AchievementBadge = ({ achievement }) => {
    return (
        <div className="achievement-badge">
            <div className="achievement-icon">{achievement.icon || '🏅'}</div>
            <div className="achievement-info">
                <div className="achievement-name">{achievement.name}</div>
                {achievement.unlockedAt && (
                    <div className="achievement-date">
                        {new Date(achievement.unlockedAt).toLocaleDateString()}
                    </div>
                )}
            </div>
        </div>
    );
};
