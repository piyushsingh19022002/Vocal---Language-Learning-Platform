const express = require('express');
const Lesson = require('../models/Lesson');
const { protect } = require('../middleware/auth');
const { checkCourseAccess } = require('../middleware/courseAccess');

const router = express.Router();

// @route   GET /api/lessons
// @desc    Get all lessons (filtered by course access)
// @access  Private
router.get('/', protect, async (req, res) => {
  try {
    const { courseId } = req.query;
    
    // If courseId is provided, check access to that course
    if (courseId) {
      // Temporarily set courseId in params for middleware
      req.params.courseId = courseId;
      
      // Check access (will allow admins and enrolled users)
      if (req.user.role !== 'admin') {
        const isEnrolled = req.user.enrolledCourses.some(
          (id) => id.toString() === courseId.toString()
        );
        if (!isEnrolled) {
          return res.status(403).json({ 
            message: 'You do not have access to lessons in this course.' 
          });
        }
      }
    }

    const query = courseId ? { course: courseId } : {};
    
    // For non-admins without courseId, filter by enrolled courses
    if (!courseId && req.user.role !== 'admin') {
      if (req.user.enrolledCourses.length === 0) {
        return res.json([]);
      }
      query.course = { $in: req.user.enrolledCourses };
    }

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
// @desc    Get single lesson (with course access control)
// @access  Private
router.get('/:id', protect, async (req, res) => {
  try {
    const lesson = await Lesson.findById(req.params.id)
      .populate('course')
      .populate('vocabulary');
    
    if (!lesson) {
      return res.status(404).json({ message: 'Lesson not found' });
    }

    // Check access to the course this lesson belongs to
    if (lesson.course) {
      const courseId = lesson.course._id || lesson.course;
      
      // Admins have access
      if (req.user.role !== 'admin') {
        const isEnrolled = req.user.enrolledCourses.some(
          (id) => id.toString() === courseId.toString()
        );
        if (!isEnrolled) {
          return res.status(403).json({ 
            message: 'You do not have access to this lesson.' 
          });
        }
      }
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

