const express = require('express');
const Vocabulary = require('../models/Vocabulary');
const { protect } = require('../middleware/auth');

const router = express.Router();

// @route   GET /api/vocabulary
// @desc    Get all vocabulary words
// @access  Public
router.get('/', async (req, res) => {
  try {
    const { language, unit, difficulty } = req.query;
    const query = {};
    if (language) query.language = language;
    if (unit) query.unit = unit;
    if (difficulty) query.difficulty = difficulty;

    const vocabulary = await Vocabulary.find(query).sort({ createdAt: -1 });
    res.json(vocabulary);
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
// @desc    Create vocabulary word
// @access  Private (Admin)
router.post('/', protect, async (req, res) => {
  try {
    const vocabulary = await Vocabulary.create(req.body);
    res.status(201).json(vocabulary);
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
      { new: true }
    );
    if (!vocabulary) {
      return res.status(404).json({ message: 'Vocabulary not found' });
    }
    res.json(vocabulary);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;

