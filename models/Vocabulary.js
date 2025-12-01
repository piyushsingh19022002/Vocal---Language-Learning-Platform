const mongoose = require('mongoose');

const vocabularySchema = new mongoose.Schema({
  word: {
    type: String,
    required: true,
    trim: true,
  },
  translation: {
    type: String,
    default: '',
  },
  language: {
    type: String,
    required: true,
  },
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    default: null,
  },
  unit: {
    type: String,
    default: '',
  },
  image: {
    type: String,
    default: '',
  },
  audioUrl: {
    type: String,
    default: '',
  },
  difficulty: {
    type: String,
    enum: ['New', 'Difficult', 'Learned'],
    default: 'New',
  },
  category: {
    type: String,
    default: '',
  },
}, {
  timestamps: true,
});

module.exports = mongoose.model('Vocabulary', vocabularySchema);

