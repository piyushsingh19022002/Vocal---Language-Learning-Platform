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

