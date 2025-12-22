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

    // Add lesson to course's lessons array
    if (req.body.course) {
      const Course = require('../models/Course');
      await Course.findByIdAndUpdate(
        req.body.course,
        { $push: { lessons: lesson._id }, $inc: { lessonCount: 1 } }
      );
    }

    res.status(201).json(lesson);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// @route   PUT /api/lessons/:id
// @desc    Update a lesson
// @access  Private (Admin)
router.put('/:id', protect, async (req, res) => {
  try {
    const lesson = await Lesson.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );
    if (!lesson) {
      return res.status(404).json({ message: 'Lesson not found' });
    }
    res.json(lesson);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// @route   DELETE /api/lessons/:id
// @desc    Delete a lesson
// @access  Private (Admin)
router.delete('/:id', protect, async (req, res) => {
  try {
    const lesson = await Lesson.findById(req.params.id);
    if (!lesson) {
      return res.status(404).json({ message: 'Lesson not found' });
    }

    // Remove lesson from course's lessons array
    if (lesson.course) {
      const Course = require('../models/Course');
      await Course.findByIdAndUpdate(
        lesson.course,
        { $pull: { lessons: lesson._id }, $inc: { lessonCount: -1 } }
      );
    }

    await lesson.deleteOne();
    res.json({ message: 'Lesson deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// @route   POST /api/lessons/ask-ai
// @desc    Get AI assistance for lesson content
// @access  Public
router.post('/ask-ai', async (req, res) => {
  try {
    const { context, question } = req.body;

    if (!question || question.trim().length === 0) {
      return res.status(400).json({ message: 'Question is required' });
    }

    // Check if Gemini API key is configured
    if (!process.env.API_CHAT) {
      return res.status(500).json({
        message: 'AI service is not configured. Please contact administrator.'
      });
    }

    // Import Gemini AI
    const { GoogleGenAI } = require('@google/genai');
    const ai = new GoogleGenAI({ apiKey: process.env.API_CHAT });

    // Create a focused prompt for grammar/language learning assistance
    const systemPrompt = `You are an expert English grammar and language learning tutor.

Context from the lesson:
${context}

Student's question:
${question}

Please provide a clear, helpful, and educational response that:
1. Directly answers the student's question
2. Provides relevant examples
3. Explains grammar rules clearly
4. Uses simple language appropriate for language learners
5. Includes practical usage tips when relevant

Keep your response concise but comprehensive (200-300 words).`;

    // Call Gemini API
    console.log('Calling Gemini API for lesson assistance...');
    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: [
        {
          role: "user",
          parts: [{ text: systemPrompt }]
        }
      ]
    });

    const aiResponse = response.candidates[0].content.parts[0].text;
    console.log('AI response received successfully');

    res.json({
      success: true,
      answer: aiResponse
    });

  } catch (error) {
    console.error('Error getting AI assistance:', error);
    res.status(500).json({
      message: 'Failed to get AI assistance. Please try again later.',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
});

module.exports = router;

