const mongoose = require('mongoose');

const lessonSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    trim: true,
  },
  course: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Course',
    required: true,
  },
  type: {
    type: String,
    enum: ['Listening', 'Speaking', 'Reading', 'Writing', 'Vocabulary'],
    required: true,
  },
  description: {
    type: String,
    default: '',
  },
  audioUrl: {
    type: String,
    default: '',
  },
  content: {
    type: String,
    default: '',
  },
  // Structured content for detailed lessons
  sections: [{
    title: String,
    content: String,
    examples: [{
      text: String,
      explanation: String
    }]
  }],
  practiceExercises: [{
    question: String,
    type: {
      type: String,
      enum: ['multiple-choice', 'fill-blank', 'matching', 'true-false'],
      default: 'multiple-choice'
    },
    options: [String],
    correctAnswer: Number,
    explanation: String
  }],
  learningOutcomes: [String],
  // Frontend hint to render action buttons (Listen/Translate/Learn with AI)
  renderActions: {
    type: Boolean,
    default: false,
  },
  // Default prompts to show in the AI helper panel for a lesson
  aiPrompts: [String],
  questions: [{
    question: String,
    options: [String],
    correctAnswer: Number,
    explanation: String,
  }],
  order: {
    type: Number,
    default: 0,
  },
  vocabulary: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Vocabulary',
  }],
}, {
  timestamps: true,
});

module.exports = mongoose.model('Lesson', lessonSchema);

