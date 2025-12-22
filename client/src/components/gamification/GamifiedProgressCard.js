import React, { useState } from 'react';
import {
    LevelProgressBar,
    ActivityStatsGrid,
    StreakCounter,
    AchievementBadge
} from './GamificationComponents';
import './GamificationCards.css';

const GamifiedProgressCard = ({ summary, achievements }) => {
    const [isExpanded, setIsExpanded] = useState(false);

    if (!summary) {
        return (
            <div className="gamified-progress-card loading">
                <div className="loading-spinner">Loading progress...</div>
            </div>
        );
    }

    const { speaking, listening, vocabulary, overall } = summary;
    const recentAchievements = achievements?.unlocked?.slice(-3) || [];

    return (
        <div className={`gamified-progress-card ${isExpanded ? 'expanded' : ''}`}>
            <div className="card-header">
                <h2 className="card-title">
                    <span className="title-icon">🏆</span>
                    Your Learning Journey
                </h2>
                <button
                    className="expand-toggle"
                    onClick={() => setIsExpanded(!isExpanded)}
                >
                    {isExpanded ? '▼' : '▶'}
                </button>
            </div>

            {/* Level Progress - Always Visible */}
            <LevelProgressBar
                level={overall.level}
                xp={overall.xp}
                xpToNext={overall.xpToNextLevel}
            />

            {/* Activity Stats Grid */}
            <ActivityStatsGrid
                speaking={speaking}
                listening={listening}
                vocabulary={vocabulary}
            />

            {/* Expanded Content */}
            {isExpanded && (
                <div className="expanded-content">
                    {/* Recent Achievements */}
                    {recentAchievements.length > 0 && (
                        <div className="recent-achievements">
                            <h3>Recent Achievements</h3>
                            <div className="achievements-list">
                                {recentAchievements.map((achievement, index) => (
                                    <AchievementBadge key={index} achievement={achievement} />
                                ))}
                            </div>
                        </div>
                    )}

                    {/* Overall Stats */}
                    <div className="overall-stats">
                        <div className="stat-box">
                            <div className="stat-icon">💪</div>
                            <div className="stat-info">
                                <div className="stat-number">{overall.totalXP.toLocaleString()}</div>
                                <div className="stat-label">Total XP Earned</div>
                            </div>
                        </div>
                        <div className="stat-box">
                            <div className="stat-icon">🎯</div>
                            <div className="stat-info">
                                <div className="stat-number">Level {overall.level}</div>
                                <div className="stat-label">Current Level</div>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default GamifiedProgressCard;
