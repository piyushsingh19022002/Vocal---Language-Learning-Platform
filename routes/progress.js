const express = require('express');
const Vocabulary = require('../models/Vocabulary');
const User = require('../models/User');
const jwt = require('jsonwebtoken');
const { protect } = require('../middleware/auth');

const router = express.Router();

// Helper function to update user progress
const updateUserProgress = async (userId, language) => {
  try {
    if (!userId) return;

    const user = await User.findById(userId);
    if (!user) return;

    // Count learned words for this language and user
    const learnedCount = await Vocabulary.countDocuments({
      userId: userId,
      language: language,
      difficulty: 'Learned'
    });

    // Count total words for this language and user
    const totalCount = await Vocabulary.countDocuments({
      userId: userId,
      language: language
    });

    // Calculate progress percentage
    const progressPercentage = totalCount > 0 ? (learnedCount / totalCount) * 100 : 0;

    // Update user progress map
    if (!user.progress) {
      user.progress = new Map();
    }

    const languageProgress = user.progress.get(language) || {
      lessonsCompleted: 0,
      vocabularyLearned: 0,
      fluency: 0
    };

    languageProgress.vocabularyLearned = learnedCount;
    // Update fluency based on progress percentage
    languageProgress.fluency = Math.round(progressPercentage);

    user.progress.set(language, languageProgress);
    await user.save();

    return {
      learnedCount,
      totalCount,
      progressPercentage: Math.round(progressPercentage)
    };
  } catch (error) {
    console.error('Error updating user progress:', error);
    return null;
  }
};

// @route   GET /api/progress
// @desc    Get overall progress statistics
// @access  Public (works with or without auth)
router.get('/', async (req, res) => {
  try {
    const { language, userId } = req.query;
    let targetUserId = userId;

    // Try to get user from token if available
    if (!targetUserId && req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
      try {
        const token = req.headers.authorization.split(' ')[1];
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        targetUserId = decoded.id;
      } catch (authError) {
        // User not authenticated, continue without userId
      }
    }

    const query = {};
    if (targetUserId) query.userId = targetUserId;
    if (language) query.language = language;

    // Get vocabulary statistics
    const totalWords = await Vocabulary.countDocuments(query);
    const learnedWords = await Vocabulary.countDocuments({ ...query, difficulty: 'Learned' });
    const newWords = await Vocabulary.countDocuments({ ...query, difficulty: 'New' });
    const difficultWords = await Vocabulary.countDocuments({ ...query, difficulty: 'Difficult' });

    // Calculate progress percentage
    const progressPercentage = totalWords > 0 ? (learnedWords / totalWords) * 100 : 0;

    // Get progress by language if userId is provided
    let byLanguage = {};
    if (targetUserId) {
      const languages = await Vocabulary.distinct('language', { userId: targetUserId });
      for (const lang of languages) {
        const langTotal = await Vocabulary.countDocuments({ userId: targetUserId, language: lang });
        const langLearned = await Vocabulary.countDocuments({ 
          userId: targetUserId, 
          language: lang, 
          difficulty: 'Learned' 
        });
        byLanguage[lang] = {
          total: langTotal,
          learned: langLearned,
          progress: langTotal > 0 ? Math.round((langLearned / langTotal) * 100) : 0
        };
      }
    }

    res.json({
      totalWords,
      learnedWords,
      newWords,
      difficultWords,
      progressPercentage: Math.round(progressPercentage),
      byLanguage,
      userId: targetUserId
    });
  } catch (error) {
    console.error('Error fetching progress:', error);
    res.status(500).json({ message: error.message });
  }
});

// @route   GET /api/progress/:language
// @desc    Get progress for a specific language
// @access  Public (works with or without auth)
router.get('/:language', async (req, res) => {
  try {
    const { language } = req.params;
    const { userId } = req.query;
    let targetUserId = userId;

    // Try to get user from token if available
    if (!targetUserId && req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
      try {
        const token = req.headers.authorization.split(' ')[1];
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        targetUserId = decoded.id;
      } catch (authError) {
        // User not authenticated, continue without userId
      }
    }

    const query = { language };
    if (targetUserId) query.userId = targetUserId;

    const totalWords = await Vocabulary.countDocuments(query);
    const learnedWords = await Vocabulary.countDocuments({ ...query, difficulty: 'Learned' });
    const newWords = await Vocabulary.countDocuments({ ...query, difficulty: 'New' });
    const difficultWords = await Vocabulary.countDocuments({ ...query, difficulty: 'Difficult' });

    const progressPercentage = totalWords > 0 ? (learnedWords / totalWords) * 100 : 0;

    // Get user progress if userId is provided
    let userProgress = null;
    if (targetUserId) {
      const user = await User.findById(targetUserId);
      if (user && user.progress) {
        const langProgress = user.progress.get(language);
        if (langProgress) {
          userProgress = {
            vocabularyLearned: langProgress.vocabularyLearned,
            lessonsCompleted: langProgress.lessonsCompleted,
            fluency: langProgress.fluency
          };
        }
      }
    }

    res.json({
      language,
      totalWords,
      learnedWords,
      newWords,
      difficultWords,
      progressPercentage: Math.round(progressPercentage),
      userProgress,
      userId: targetUserId
    });
  } catch (error) {
    console.error('Error fetching language progress:', error);
    res.status(500).json({ message: error.message });
  }
});

// @route   GET /api/progress/user/:userId
// @desc    Get progress for a specific user
// @access  Private
router.get('/user/:userId', protect, async (req, res) => {
  try {
    const { userId } = req.params;
    const { language } = req.query;

    // Verify user can only access their own progress
    if (req.user._id.toString() !== userId) {
      return res.status(403).json({ message: 'Not authorized to access this progress' });
    }

    const query = { userId };
    if (language) query.language = language;

    const totalWords = await Vocabulary.countDocuments(query);
    const learnedWords = await Vocabulary.countDocuments({ ...query, difficulty: 'Learned' });
    const newWords = await Vocabulary.countDocuments({ ...query, difficulty: 'New' });
    const difficultWords = await Vocabulary.countDocuments({ ...query, difficulty: 'Difficult' });

    const progressPercentage = totalWords > 0 ? (learnedWords / totalWords) * 100 : 0;

    // Get user progress from User model
    const user = await User.findById(userId);
    let userProgressData = {};
    if (user && user.progress) {
      if (language) {
        const langProgress = user.progress.get(language);
        if (langProgress) {
          userProgressData[language] = langProgress;
        }
      } else {
        // Get all languages
        user.progress.forEach((value, key) => {
          userProgressData[key] = value;
        });
      }
    }

    // Get progress by language
    const languages = await Vocabulary.distinct('language', { userId });
    const byLanguage = {};
    for (const lang of languages) {
      const langTotal = await Vocabulary.countDocuments({ userId, language: lang });
      const langLearned = await Vocabulary.countDocuments({ 
        userId, 
        language: lang, 
        difficulty: 'Learned' 
      });
      byLanguage[lang] = {
        total: langTotal,
        learned: langLearned,
        progress: langTotal > 0 ? Math.round((langLearned / langTotal) * 100) : 0
      };
    }

    res.json({
      userId,
      totalWords,
      learnedWords,
      newWords,
      difficultWords,
      progressPercentage: Math.round(progressPercentage),
      userProgress: userProgressData,
      byLanguage
    });
  } catch (error) {
    console.error('Error fetching user progress:', error);
    res.status(500).json({ message: error.message });
  }
});

// @route   POST /api/progress/update
// @desc    Manually update progress (usually called automatically)
// @access  Private
router.post('/update', protect, async (req, res) => {
  try {
    const { language = 'French' } = req.body;
    const userId = req.user._id;

    const progress = await updateUserProgress(userId, language);

    if (!progress) {
      return res.status(500).json({ message: 'Failed to update progress' });
    }

    res.json({
      message: 'Progress updated successfully',
      progress
    });
  } catch (error) {
    console.error('Error updating progress:', error);
    res.status(500).json({ message: error.message });
  }
});

// @route   GET /api/progress/stats/summary
// @desc    Get progress summary statistics
// @access  Public
router.get('/stats/summary', async (req, res) => {
  try {
    const { language, userId } = req.query;
    let targetUserId = userId;

    // Try to get user from token if available
    if (!targetUserId && req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
      try {
        const token = req.headers.authorization.split(' ')[1];
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        targetUserId = decoded.id;
      } catch (authError) {
        // User not authenticated, continue without userId
      }
    }

    const query = {};
    if (targetUserId) query.userId = targetUserId;
    if (language) query.language = language;

    const total = await Vocabulary.countDocuments(query);
    const learned = await Vocabulary.countDocuments({ ...query, difficulty: 'Learned' });
    const progress = total > 0 ? Math.round((learned / total) * 100) : 0;

    res.json({
      total,
      learned,
      progress,
      userId: targetUserId,
      language: language || 'all'
    });
  } catch (error) {
    console.error('Error fetching progress summary:', error);
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;
module.exports.updateUserProgress = updateUserProgress;

