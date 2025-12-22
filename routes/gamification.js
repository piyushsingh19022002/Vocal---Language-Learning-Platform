const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/auth');
const Activity = require('../models/Activity');
const User = require('../models/User');
const achievements = require('../config/achievements');
const {
    awardXP,
    checkAchievements,
    updateStreak,
    getActivitySummary
} = require('../services/gamificationService');

// All routes require authentication
router.use(protect);

// @route   GET /api/gamification/summary
// @desc    Get user's activity summary with gamification data
// @access  Private
router.get('/summary', async (req, res) => {
    try {
        const userId = req.user._id;
        const summary = await getActivitySummary(userId);
        res.json(summary);
    } catch (error) {
        console.error('Error getting activity summary:', error);
        res.status(500).json({ message: 'Failed to get activity summary' });
    }
});

// @route   GET /api/gamification/weekly
// @desc    Get weekly activity breakdown
// @access  Private
router.get('/weekly', async (req, res) => {
    try {
        const userId = req.user._id;
        const user = await User.findById(userId);

        // Get last 7 days of activities
        const sevenDaysAgo = new Date();
        sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);

        const activities = await Activity.find({
            userId,
            date: { $gte: sevenDaysAgo }
        }).sort({ date: 1 });

        // Group by day
        const dayMap = {};
        const days = [];

        for (let i = 6; i >= 0; i--) {
            const date = new Date();
            date.setDate(date.getDate() - i);
            date.setHours(0, 0, 0, 0);
            const dateStr = date.toISOString().split('T')[0];

            dayMap[dateStr] = {
                date: dateStr,
                speaking: 0,
                listening: 0,
                vocabulary: 0,
                completed: false
            };
            days.push(dayMap[dateStr]);
        }

        // Fill in activity data
        activities.forEach(activity => {
            const dateStr = new Date(activity.date).toISOString().split('T')[0];
            if (dayMap[dateStr]) {
                dayMap[dateStr][activity.activityType] += activity.duration || 0;
                dayMap[dateStr].completed = true;
            }
        });

        // Calculate breakdown
        let totalSpeaking = 0, totalListening = 0, totalVocabulary = 0;
        let speakingSessions = 0, listeningLessons = 0, vocabularyReviews = 0;

        activities.forEach(activity => {
            switch (activity.activityType) {
                case 'speaking':
                    totalSpeaking += activity.duration || 0;
                    speakingSessions++;
                    break;
                case 'listening':
                    totalListening += activity.duration || 0;
                    if (activity.details?.completed) listeningLessons++;
                    break;
                case 'vocabulary':
                    totalVocabulary += activity.duration || 0;
                    vocabularyReviews++;
                    break;
            }
        });

        const totalTime = totalSpeaking + totalListening + totalVocabulary;

        const breakdown = {
            speaking: {
                sessions: speakingSessions,
                percentage: totalTime > 0 ? Math.round((totalSpeaking / totalTime) * 100) : 0
            },
            listening: {
                lessons: listeningLessons,
                percentage: totalTime > 0 ? Math.round((totalListening / totalTime) * 100) : 0
            },
            vocabulary: {
                reviews: vocabularyReviews,
                percentage: totalTime > 0 ? Math.round((totalVocabulary / totalTime) * 100) : 0
            }
        };

        // Weekly challenge
        const completedDays = days.filter(d => d.completed).length;
        const weeklyChallenge = {
            target: 5,
            completed: completedDays,
            reward: 100
        };

        res.json({
            days,
            streak: user.gamification?.streaks?.current || 0,
            weeklyChallenge,
            breakdown
        });
    } catch (error) {
        console.error('Error getting weekly activity:', error);
        res.status(500).json({ message: 'Failed to get weekly activity' });
    }
});

// @route   POST /api/gamification/award-xp
// @desc    Award XP for an activity
// @access  Private
router.post('/award-xp', async (req, res) => {
    try {
        const userId = req.user._id;
        const { activityType, duration, score, accuracy, completed, wordsLearned, wordsReviewed } = req.body;

        const details = {
            duration,
            score,
            accuracy,
            completed,
            wordsLearned,
            wordsReviewed
        };

        const result = await awardXP(userId, activityType, details);
        await updateStreak(userId);

        res.json(result);
    } catch (error) {
        console.error('Error awarding XP:', error);
        res.status(500).json({ message: 'Failed to award XP' });
    }
});

// @route   GET /api/gamification/achievements
// @desc    Get user's achievements
// @access  Private
router.get('/achievements', async (req, res) => {
    try {
        const userId = req.user._id;
        const user = await User.findById(userId);

        const unlocked = user.gamification?.achievements || [];
        const unlockedIds = unlocked.map(a => a.id);

        const available = achievements
            .filter(a => !unlockedIds.includes(a.id))
            .map(a => ({
                ...a,
                progress: 0 // TODO: Calculate actual progress
            }));

        res.json({
            unlocked,
            available
        });
    } catch (error) {
        console.error('Error getting achievements:', error);
        res.status(500).json({ message: 'Failed to get achievements' });
    }
});

module.exports = router;
