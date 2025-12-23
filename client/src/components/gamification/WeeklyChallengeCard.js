import React, { useState } from 'react';
import {
    WeekCalendar,
    ActivityBreakdown,
    StreakCounter
} from './GamificationComponents';
import './GamificationCards.css';

const WeeklyChallengeCard = ({ weeklyData, onViewReport }) => {
    if (!weeklyData) {
        return (
            <div className="weekly-challenge-card loading">
                <div className="loading-spinner">Loading weekly activity...</div>
            </div>
        );
    }

    const { days, streak, weeklyChallenge, breakdown } = weeklyData;
    const completedDays = days.filter(d => d.completed).length;
    const challengeProgress = (completedDays / weeklyChallenge.target) * 100;

    return (
        <div className="weekly-challenge-card">
            <div className="card-header">
                <h2 className="card-title">
                    <span className="title-icon">📅</span>
                    Weekly Challenge
                </h2>
            </div>

            {/* Streak Counter */}
            <StreakCounter current={streak} longest={streak} />

            {/* Week Calendar */}
            <WeekCalendar days={days} />

            {/* Challenge Progress */}
            <div className="challenge-progress">
                <div className="challenge-header">
                    <h3>Complete {weeklyChallenge.target} days this week</h3>
                    <div className="challenge-status">
                        {completedDays}/{weeklyChallenge.target} ⚡
                    </div>
                </div>
                <div className="challenge-bar-container">
                    <div
                        className="challenge-bar"
                        style={{ width: `${Math.min(challengeProgress, 100)}%` }}
                    >
                        {challengeProgress >= 20 && (
                            <span className="challenge-percentage">
                                {Math.round(challengeProgress)}%
                            </span>
                        )}
                    </div>
                </div>
                {completedDays >= weeklyChallenge.target && (
                    <div className="challenge-reward">
                        🎉 Challenge Complete! +{weeklyChallenge.reward} XP Bonus
                    </div>
                )}
            </div>

            {/* Activity Breakdown */}
            <div className="breakdown-section">
                <h3>Activity Breakdown</h3>
                <ActivityBreakdown breakdown={breakdown} />
            </div>

            {/* View Report Button */}
            <button className="btn-view-report" onClick={onViewReport}>
                <span className="report-icon">📊</span>
                View Detailed Report
            </button>
        </div>
    );
};

export default WeeklyChallengeCard;
