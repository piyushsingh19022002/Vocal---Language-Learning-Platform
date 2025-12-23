import React, { useState, useEffect } from 'react';
import { getGamificationSummary, getWeeklyGamificationActivity, getAchievements } from '../../utils/api';
import GamifiedProgressCard from './GamifiedProgressCard';
import WeeklyChallengeCard from './WeeklyChallengeCard';

const GamificationDashboard = ({ onViewReport }) => {
    const [summary, setSummary] = useState(null);
    const [weeklyData, setWeeklyData] = useState(null);
    const [achievements, setAchievements] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchGamificationData = async () => {
            try {
                setLoading(true);
                const [summaryData, weeklyActivityData, achievementsData] = await Promise.all([
                    getGamificationSummary(),
                    getWeeklyGamificationActivity(),
                    getAchievements()
                ]);

                setSummary(summaryData);
                setWeeklyData(weeklyActivityData);
                setAchievements(achievementsData);
            } catch (err) {
                console.error('Error fetching gamification data:', err);
                setError(err.message);
            } finally {
                setLoading(false);
            }
        };

        fetchGamificationData();
    }, []);

    if (loading) {
        return (
            <div className="gamification-loading">
                <div className="loading-spinner">Loading your progress...</div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="gamification-error">
                <p>Unable to load gamification data. Please try again later.</p>
            </div>
        );
    }

    return (
        <div className="gamification-dashboard">
            <GamifiedProgressCard summary={summary} achievements={achievements} />
            <WeeklyChallengeCard weeklyData={weeklyData} onViewReport={onViewReport} />
        </div>
    );
};

export default GamificationDashboard;
