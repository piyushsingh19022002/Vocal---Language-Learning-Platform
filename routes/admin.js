const express = require('express');
const { protect } = require('../middleware/auth');
const { admin } = require('../middleware/admin');
const User = require('../models/User');
const Course = require('../models/Course');
const ListeningLesson = require('../models/ListeningLesson');
const ContactMessage = require('../models/ContactMessage');

const router = express.Router();

// Apply auth + admin middleware to all admin routes
router.use(protect, admin);

// @route   GET /api/admin/summary
// @desc    Get admin dashboard summary stats
// @access  Private/Admin
router.get('/summary', async (req, res) => {
  try {
    const [totalUsers, verifiedUsers, totalCourses, listeningLessons, contactMessages] =
      await Promise.all([
        User.countDocuments(),
        User.countDocuments({ isVerified: true }),
        Course.countDocuments(),
        ListeningLesson.countDocuments(),
        ContactMessage.countDocuments(),
      ]);

    res.json({
      totalUsers,
      verifiedUsers,
      totalCourses,
      listeningLessons,
      contactMessages,
    });
  } catch (error) {
    console.error('Admin summary error:', error);
    res.status(500).json({ message: 'Failed to load admin summary' });
  }
});

// =========================
// Users Management
// =========================

// @route   GET /api/admin/users
// @desc    List users
// @access  Private/Admin
router.get('/users', async (req, res) => {
  try {
    const users = await User.find()
      .select('-password -otp')
      .sort({ createdAt: -1 });
    res.json(users);
  } catch (error) {
    console.error('Admin users list error:', error);
    res.status(500).json({ message: 'Failed to load users' });
  }
});

// @route   PATCH /api/admin/users/:id/block
// @desc    Block or unblock a user
// @access  Private/Admin
router.patch('/users/:id/block', async (req, res) => {
  try {
    const { blocked } = req.body;

    if (typeof blocked !== 'boolean') {
      return res.status(400).json({ message: 'blocked must be a boolean' });
    }

    // Prevent admins from blocking themselves
    if (req.user._id.toString() === req.params.id) {
      return res.status(400).json({ message: 'You cannot block your own account' });
    }

    const user = await User.findByIdAndUpdate(
      req.params.id,
      { isBlocked: blocked },
      { new: true }
    ).select('-password -otp');

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    res.json(user);
  } catch (error) {
    console.error('Admin block user error:', error);
    res.status(500).json({ message: 'Failed to update user' });
  }
});

// @route   DELETE /api/admin/users/:id
// @desc    Delete a user
// @access  Private/Admin
router.delete('/users/:id', async (req, res) => {
  try {
    // Prevent admins from deleting themselves
    if (req.user._id.toString() === req.params.id) {
      return res.status(400).json({ message: 'You cannot delete your own account' });
    }

    const user = await User.findByIdAndDelete(req.params.id);

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    res.json({ message: 'User deleted successfully' });
  } catch (error) {
    console.error('Admin delete user error:', error);
    res.status(500).json({ message: 'Failed to delete user' });
  }
});

// =========================
// Courses Management
// =========================

// @route   GET /api/admin/courses
// @desc    List all courses
// @access  Private/Admin
router.get('/courses', async (req, res) => {
  try {
    const courses = await Course.find().sort({ createdAt: -1 });
    res.json(courses);
  } catch (error) {
    console.error('Admin courses list error:', error);
    res.status(500).json({ message: 'Failed to load courses' });
  }
});

// @route   POST /api/admin/courses
// @desc    Create a new course
// @access  Private/Admin
router.post('/courses', async (req, res) => {
  try {
    const course = await Course.create(req.body);
    res.status(201).json(course);
  } catch (error) {
    console.error('Admin create course error:', error);
    res.status(500).json({ message: 'Failed to create course' });
  }
});

// @route   PUT /api/admin/courses/:id
// @desc    Update a course
// @access  Private/Admin
router.put('/courses/:id', async (req, res) => {
  try {
    const course = await Course.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });

    if (!course) {
      return res.status(404).json({ message: 'Course not found' });
    }

    res.json(course);
  } catch (error) {
    console.error('Admin update course error:', error);
    res.status(500).json({ message: 'Failed to update course' });
  }
});

// @route   DELETE /api/admin/courses/:id
// @desc    Delete a course
// @access  Private/Admin
router.delete('/courses/:id', async (req, res) => {
  try {
    const course = await Course.findByIdAndDelete(req.params.id);

    if (!course) {
      return res.status(404).json({ message: 'Course not found' });
    }

    res.json({ message: 'Course deleted successfully' });
  } catch (error) {
    console.error('Admin delete course error:', error);
    res.status(500).json({ message: 'Failed to delete course' });
  }
});

// =========================
// Listening Lessons Management
// =========================

// @route   GET /api/admin/listening-lessons
// @desc    List listening lessons
// @access  Private/Admin
router.get('/listening-lessons', async (req, res) => {
  try {
    const lessons = await ListeningLesson.find().sort({ createdAt: -1 });
    res.json(lessons);
  } catch (error) {
    console.error('Admin listening lessons list error:', error);
    res.status(500).json({ message: 'Failed to load listening lessons' });
  }
});

// @route   DELETE /api/admin/listening-lessons/:id
// @desc    Delete a listening lesson
// @access  Private/Admin
router.delete('/listening-lessons/:id', async (req, res) => {
  try {
    const lesson = await ListeningLesson.findByIdAndDelete(req.params.id);

    if (!lesson) {
      return res.status(404).json({ message: 'Listening lesson not found' });
    }

    res.json({ message: 'Listening lesson deleted successfully' });
  } catch (error) {
    console.error('Admin delete listening lesson error:', error);
    res.status(500).json({ message: 'Failed to delete listening lesson' });
  }
});

// =========================
// Contact Messages Management
// =========================

// @route   GET /api/admin/contact-messages
// @desc    List contact messages
// @access  Private/Admin
router.get('/contact-messages', async (req, res) => {
  try {
    const messages = await ContactMessage.find()
      .sort({ createdAt: -1 });
    res.json(messages);
  } catch (error) {
    console.error('Admin contact messages list error:', error);
    res.status(500).json({ message: 'Failed to load contact messages' });
  }
});

// @route   GET /api/admin/contact-messages/:id
// @desc    Get single contact message
// @access  Private/Admin
router.get('/contact-messages/:id', async (req, res) => {
  try {
    const message = await ContactMessage.findById(req.params.id);
    if (!message) {
      return res.status(404).json({ message: 'Contact message not found' });
    }
    res.json(message);
  } catch (error) {
    console.error('Admin contact message detail error:', error);
    res.status(500).json({ message: 'Failed to load contact message' });
  }
});

// @route   PATCH /api/admin/contact-messages/:id/read
// @desc    Mark contact message as read
// @access  Private/Admin
router.patch('/contact-messages/:id/read', async (req, res) => {
  try {
    const message = await ContactMessage.findByIdAndUpdate(
      req.params.id,
      { isRead: true },
      { new: true }
    );

    if (!message) {
      return res.status(404).json({ message: 'Contact message not found' });
    }

    res.json(message);
  } catch (error) {
    console.error('Admin mark contact message read error:', error);
    res.status(500).json({ message: 'Failed to update contact message' });
  }
});

module.exports = router;

