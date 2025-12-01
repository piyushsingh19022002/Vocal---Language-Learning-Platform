const express = require('express');
const Vocabulary = require('../models/Vocabulary');
const User = require('../models/User');
const jwt = require('jsonwebtoken');
const { protect } = require('../middleware/auth');

const router = express.Router();

// Helper function to parse sentence into words
const parseSentenceIntoWords = (sentence, language = 'French') => {
  // Remove punctuation and split by spaces
  const words = sentence
    .replace(/[.,!?;:]/g, '')
    .split(/\s+/)
    .filter(word => word.length > 0)
    .map(word => word.toLowerCase().trim());
  
  return words.map(word => ({
    word,
    translation: '', // Can be filled later or by translation API
    language,
    difficulty: 'New',
    category: 'user-added'
  }));
};

// @route   GET /api/vocabulary
// @desc    Get all vocabulary words with enhanced search
// @access  Public
router.get('/', async (req, res) => {
  try {
    const { language, unit, difficulty, search, userId } = req.query;
    const query = {};
    
    if (language) query.language = language;
    if (unit) query.unit = unit;
    if (difficulty) query.difficulty = difficulty;
    if (userId) query.userId = userId;

    let vocabulary = await Vocabulary.find(query).sort({ createdAt: -1 });

    // Enhanced search: search in both word and translation
    if (search) {
      const searchRegex = new RegExp(search, 'i');
      vocabulary = vocabulary.filter(
        item => 
          searchRegex.test(item.word) || 
          searchRegex.test(item.translation) ||
          (item.category && searchRegex.test(item.category))
      );
    }

    res.json(vocabulary);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// @route   GET /api/vocabulary/search
// @desc    Advanced search for vocabulary
// @access  Public
router.get('/search', async (req, res) => {
  try {
    const { q, language } = req.query;
    if (!q) {
      return res.status(400).json({ message: 'Search query is required' });
    }

    const searchRegex = new RegExp(q, 'i');
    const query = {
      $or: [
        { word: searchRegex },
        { translation: searchRegex },
        { category: searchRegex }
      ]
    };

    if (language) query.language = language;

    const vocabulary = await Vocabulary.find(query)
      .limit(50)
      .sort({ createdAt: -1 });

    res.json(vocabulary);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// @route   GET /api/vocabulary/stats/summary
// @desc    Get vocabulary statistics
// @access  Public
router.get('/stats/summary', async (req, res) => {
  try {
    const { language, userId } = req.query;
    const query = {};
    if (language) query.language = language;
    if (userId) query.userId = userId;

    const total = await Vocabulary.countDocuments(query);
    const byDifficulty = await Vocabulary.aggregate([
      { $match: query },
      { $group: { _id: '$difficulty', count: { $sum: 1 } } }
    ]);
    const byLanguage = await Vocabulary.aggregate([
      { $match: userId ? { userId } : {} },
      { $group: { _id: '$language', count: { $sum: 1 } } }
    ]);

    res.json({
      total,
      byDifficulty: byDifficulty.reduce((acc, item) => {
        acc[item._id] = item.count;
        return acc;
      }, {}),
      byLanguage: byLanguage.reduce((acc, item) => {
        acc[item._id] = item.count;
        return acc;
      }, {})
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// @route   GET /api/vocabulary/:id
// @desc    Get single vocabulary word
// @access  Public
router.get('/:id', async (req, res) => {
  try {
    const vocabulary = await Vocabulary.findById(req.params.id);
    if (!vocabulary) {
      return res.status(404).json({ message: 'Vocabulary not found' });
    }
    res.json(vocabulary);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// @route   POST /api/vocabulary
// @desc    Create vocabulary word or sentence
// @access  Public (works with or without auth)
router.post('/', async (req, res) => {
  try {
    // Try to get user from token if available, but don't require it
    let userId = null;
    if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
      try {
        const token = req.headers.authorization.split(' ')[1];
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        const user = await User.findById(decoded.id).select('-password');
        if (user) {
          userId = user._id;
        }
      } catch (authError) {
        // User not authenticated, continue without userId
        console.log('User not authenticated, creating vocabulary without userId');
      }
    }

    const { word, sentence, language = 'French' } = req.body;
    
    // If sentence is provided, parse it into words
    if (sentence) {
      const words = parseSentenceIntoWords(sentence, language);
      const vocabularyItems = await Vocabulary.insertMany(
        words.map(w => ({ ...w, userId }))
      );
      return res.status(201).json({ 
        message: `Added ${vocabularyItems.length} words from sentence`,
        vocabulary: vocabularyItems 
      });
    }

    // Single word creation
    if (!word) {
      return res.status(400).json({ message: 'Word or sentence is required' });
    }

    const vocabulary = await Vocabulary.create({
      word: req.body.word,
      translation: req.body.translation || '',
      language: req.body.language || 'French',
      difficulty: req.body.difficulty || 'New',
      userId: userId,
      unit: req.body.unit || '',
      category: req.body.category || 'user-added'
    });
    
    res.status(201).json(vocabulary);
  } catch (error) {
    console.error('Error creating vocabulary:', error);
    res.status(500).json({ 
      message: error.message || 'Error creating vocabulary',
      error: process.env.NODE_ENV === 'development' ? error.stack : undefined
    });
  }
});

// @route   POST /api/vocabulary/bulk
// @desc    Bulk create vocabulary words
// @access  Private
router.post('/bulk', protect, async (req, res) => {
  try {
    const { words, language = 'French', userId } = req.body;
    
    if (!Array.isArray(words) || words.length === 0) {
      return res.status(400).json({ message: 'Words array is required' });
    }

    const vocabularyItems = words.map(word => ({
      word: typeof word === 'string' ? word : word.word,
      translation: word.translation || '',
      language: word.language || language,
      difficulty: word.difficulty || 'New',
      category: word.category || 'user-added',
      userId: userId || req.user?._id
    }));

    const created = await Vocabulary.insertMany(vocabularyItems);
    res.status(201).json({ 
      message: `Successfully added ${created.length} words`,
      vocabulary: created 
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// @route   POST /api/vocabulary/parse-sentence
// @desc    Parse sentence into words (doesn't save, just returns parsed words)
// @access  Public
router.post('/parse-sentence', async (req, res) => {
  try {
    const { sentence, language = 'French' } = req.body;
    
    if (!sentence) {
      return res.status(400).json({ message: 'Sentence is required' });
    }

    const words = parseSentenceIntoWords(sentence, language);
    res.json({ 
      sentence,
      words,
      wordCount: words.length 
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// @route   PUT /api/vocabulary/:id
// @desc    Update vocabulary word
// @access  Private
router.put('/:id', protect, async (req, res) => {
  try {
    const vocabulary = await Vocabulary.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );
    if (!vocabulary) {
      return res.status(404).json({ message: 'Vocabulary not found' });
    }
    res.json(vocabulary);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// @route   DELETE /api/vocabulary/:id
// @desc    Delete vocabulary word
// @access  Private
router.delete('/:id', protect, async (req, res) => {
  try {
    const vocabulary = await Vocabulary.findByIdAndDelete(req.params.id);
    if (!vocabulary) {
      return res.status(404).json({ message: 'Vocabulary not found' });
    }
    res.json({ message: 'Vocabulary deleted successfully', vocabulary });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// @route   DELETE /api/vocabulary
// @desc    Delete multiple vocabulary words
// @access  Private
router.delete('/', protect, async (req, res) => {
  try {
    const { ids } = req.body;
    
    if (!Array.isArray(ids) || ids.length === 0) {
      return res.status(400).json({ message: 'Array of IDs is required' });
    }

    const result = await Vocabulary.deleteMany({ _id: { $in: ids } });
    res.json({ 
      message: `Deleted ${result.deletedCount} vocabulary items`,
      deletedCount: result.deletedCount 
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;

