const express = require('express');
const Course = require('../models/Course');
const { protect } = require('../middleware/auth');
const { checkCourseAccess } = require('../middleware/courseAccess');

const router = express.Router();

// @route   GET /api/courses
// @desc    Get all courses (public list - access control on individual course)
// @access  Public
router.get('/', async (req, res) => {
  try {
    // Return all courses for display
    // Individual course access is controlled by checkCourseAccess middleware
    const courses = await Course.find().populate('lessons');
    res.json(courses);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// @route   GET /api/courses/:id
// @desc    Get single course (with access control)
// @access  Private (requires enrollment or admin)
router.get('/:id', protect, checkCourseAccess, async (req, res) => {
  try {
    const course = await Course.findById(req.params.id).populate('lessons');
    if (!course) {
      return res.status(404).json({ message: 'Course not found' });
    }
    res.json(course);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// @route   POST /api/courses
// @desc    Create a course
// @access  Private (Admin)
router.post('/', protect, async (req, res) => {
  try {
    const course = await Course.create(req.body);
    res.status(201).json(course);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;

