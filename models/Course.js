const mongoose = require('mongoose');

const courseSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true,
  },
  language: {
    type: String,
    required: true,
    trim: true,
  },
  description: {
    type: String,
    required: true,
  },
  level: {
    type: String,
    enum: ['Beginner', 'Intermediate', 'Advanced'],
    default: 'Beginner',
  },
  // Course type: listening, vocabulary, reading, speaking, mixed
  type: {
    type: String,
    enum: ['listening', 'vocabulary', 'reading', 'speaking', 'mixed'],
    default: 'mixed',
  },
  // Course status: active, coming_soon, draft
  status: {
    type: String,
    enum: ['active', 'coming_soon', 'draft'],
    default: 'active',
  },
  lessons: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Lesson',
  }],
  image: {
    type: String,
    default: '',
  },
  studentsEnrolled: {
    type: Number,
    default: 0,
  },
  // Skill tags for filtering
  skillTags: [{
    type: String,
    trim: true,
  }],
  // Micro-course support
  isMicroCourse: {
    type: Boolean,
    default: false,
  },
  durationInDays: {
    type: Number,
    default: null,
  },
  lessonCount: {
    type: Number,
    default: 0,
  },
  // Estimated time metadata
  estimatedTimeHours: {
    type: Number,
    default: null,
  },
  estimatedDays: {
    type: Number,
    default: null,
  },
  // Preview settings (UI-ready, no payment logic)
  freePreviewLessons: {
    type: Number,
    default: 0,
  },
}, {
  timestamps: true,
});

module.exports = mongoose.model('Course', courseSchema);

