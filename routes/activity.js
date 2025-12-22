const express = require('express');
const Activity = require('../models/Activity');
const User = require('../models/User');
const { protect } = require('../middleware/auth');

const router = express.Router();

// @route   POST /api/activity
// @desc    Log a new activity
// @access  Private
router.post('/', protect, async (req, res) => {
    try {
        const { activityType, duration, details } = req.body;

        const activity = await Activity.create({
            userId: req.user._id,
            activityType,
            duration,
            details
        });

        // Update user's total practice time
        await User.findByIdAndUpdate(req.user._id, {
            $inc: { practiceTime: Math.round(duration / 60) }, // Convert seconds to minutes
            lastActiveDate: new Date()
        });

        res.status(201).json(activity);
    } catch (error) {
        console.error('Error logging activity:', error);
        res.status(500).json({ message: error.message });
    }
});

// @route   GET /api/activity/weekly
// @desc    Get weekly activity summary
// @access  Private
router.get('/weekly', protect, async (req, res) => {
    try {
        const oneWeekAgo = new Date();
        oneWeekAgo.setDate(oneWeekAgo.getDate() - 7);

        const activities = await Activity.find({
            userId: req.user._id,
            date: { $gte: oneWeekAgo }
        }).sort({ date: -1 });

        // Aggregate by activity type
        const summary = {
            totalDuration: 0,
            speaking: { count: 0, duration: 0, avgScore: 0, totalScore: 0 },
            listening: { count: 0, duration: 0, avgAccuracy: 0, totalAccuracy: 0 },
            vocabulary: { count: 0, duration: 0, wordsLearned: 0 },
            dailyBreakdown: {}
        };

        activities.forEach(activity => {
            summary.totalDuration += activity.duration;

            const dayKey = activity.date.toISOString().split('T')[0];
            if (!summary.dailyBreakdown[dayKey]) {
                summary.dailyBreakdown[dayKey] = {
                    speaking: 0,
                    listening: 0,
                    vocabulary: 0
                };
            }
            summary.dailyBreakdown[dayKey][activity.activityType] += activity.duration;

            if (activity.activityType === 'speaking') {
                summary.speaking.count++;
                summary.speaking.duration += activity.duration;
                if (activity.details?.score) {
                    summary.speaking.totalScore += activity.details.score;
                }
            } else if (activity.activityType === 'listening') {
                summary.listening.count++;
                summary.listening.duration += activity.duration;
                if (activity.details?.accuracy) {
                    summary.listening.totalAccuracy += activity.details.accuracy;
                }
            } else if (activity.activityType === 'vocabulary') {
                summary.vocabulary.count++;
                summary.vocabulary.duration += activity.duration;
                if (activity.details?.wordsLearned) {
                    summary.vocabulary.wordsLearned += activity.details.wordsLearned;
                }
            }
        });

        // Calculate averages
        if (summary.speaking.count > 0) {
            summary.speaking.avgScore = Math.round(summary.speaking.totalScore / summary.speaking.count);
        }
        if (summary.listening.count > 0) {
            summary.listening.avgAccuracy = Math.round(summary.listening.totalAccuracy / summary.listening.count);
        }

        // Remove temporary fields
        delete summary.speaking.totalScore;
        delete summary.listening.totalAccuracy;

        res.json(summary);
    } catch (error) {
        console.error('Error fetching weekly activity:', error);
        res.status(500).json({ message: error.message });
    }
});

// @route   GET /api/activity/all
// @desc    Get all activities for a user (with pagination)
// @access  Private
router.get('/all', protect, async (req, res) => {
    try {
        const limit = parseInt(req.query.limit) || 50;
        const skip = parseInt(req.query.skip) || 0;

        const activities = await Activity.find({ userId: req.user._id })
            .sort({ date: -1 })
            .limit(limit)
            .skip(skip);

        const total = await Activity.countDocuments({ userId: req.user._id });

        res.json({
            activities,
            total,
            hasMore: total > skip + limit
        });
    } catch (error) {
        console.error('Error fetching activities:', error);
        res.status(500).json({ message: error.message });
    }
});

module.exports = router;
