const mongoose = require('mongoose');

const activitySchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
        index: true
    },
    activityType: {
        type: String,
        enum: ['speaking', 'listening', 'vocabulary', 'course'],
        required: true
    },
    duration: {
        type: Number, // in seconds
        default: 0
    },
    details: {
        // For speaking
        language: String,
        category: String,
        level: String,
        score: Number,

        // For vocabulary
        wordsLearned: Number,
        wordsReviewed: Number,

        // For listening
        lessonId: mongoose.Schema.Types.ObjectId,
        accuracy: Number,

        // Common
        completed: Boolean
    },
    date: {
        type: Date,
        default: Date.now,
        index: true
    }
}, {
    timestamps: true
});

// Index for efficient weekly queries
activitySchema.index({ userId: 1, date: -1 });
activitySchema.index({ userId: 1, activityType: 1, date: -1 });

module.exports = mongoose.model('Activity', activitySchema);
