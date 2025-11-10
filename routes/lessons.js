const express = require('express');
const Lesson = require('../models/Lesson');
const { protect } = require('../middleware/auth');

const router = express.Router();

// @route   GET /api/lessons
// @desc    Get all lessons
// @access  Public
router.get('/', async (req, res) => {
  try {
    const { courseId } = req.query;
    const query = courseId ? { course: courseId } : {};
    const lessons = await Lesson.find(query)
      .populate('course')
      .populate('vocabulary')
      .sort({ order: 1 });
    res.json(lessons);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// @route   GET /api/lessons/:id
// @desc    Get single lesson
// @access  Public
router.get('/:id', async (req, res) => {
  try {
    const lesson = await Lesson.findById(req.params.id)
      .populate('course')
      .populate('vocabulary');
    if (!lesson) {
      return res.status(404).json({ message: 'Lesson not found' });
    }
    res.json(lesson);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// @route   POST /api/lessons
// @desc    Create a lesson
// @access  Private (Admin)
router.post('/', protect, async (req, res) => {
  try {
    const lesson = await Lesson.create(req.body);
    res.status(201).json(lesson);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;

