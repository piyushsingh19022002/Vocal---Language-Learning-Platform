const Course = require('../models/Course');

/**
 * Middleware to check if user has access to a course
 * - Admins have access to ALL courses
 * - Regular users can only access courses in their enrolledCourses array
 * 
 * Usage: router.get('/:id', protect, checkCourseAccess, handler)
 * 
 * Expects:
 * - req.user (from protect middleware)
 * - req.params.courseId OR req.params.id OR req.body.courseId
 */
const checkCourseAccess = async (req, res, next) => {
  try {
    // Admins have access to all courses
    if (req.user && req.user.role === 'admin') {
      return next();
    }

    // Get courseId from params or body
    const courseId = req.params.courseId || req.params.id || req.body.courseId;
    
    if (!courseId) {
      return res.status(400).json({ message: 'Course ID is required' });
    }

    // Verify course exists
    const course = await Course.findById(courseId);
    if (!course) {
      return res.status(404).json({ message: 'Course not found' });
    }

    // Check if user is enrolled
    if (!req.user) {
      return res.status(401).json({ message: 'Authentication required' });
    }

    // Check if course is in user's enrolledCourses
    const isEnrolled = req.user.enrolledCourses.some(
      (enrolledId) => enrolledId.toString() === courseId.toString()
    );

    if (!isEnrolled) {
      return res.status(403).json({ 
        message: 'You do not have access to this course. Please contact an administrator.' 
      });
    }

    // User has access, proceed
    next();
  } catch (error) {
    console.error('Course access check error:', error);
    res.status(500).json({ message: 'Error checking course access' });
  }
};

module.exports = { checkCourseAccess };

