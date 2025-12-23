// XP Calculation utilities for gamification system

/**
 * Calculate XP required for a specific level
 * Uses exponential growth: XP = 100 * (1.5 ^ (level - 1))
 */
const xpForLevel = (level) => {
    return Math.floor(100 * Math.pow(1.5, level - 1));
};

/**
 * Calculate total XP required to reach a level
 */
const totalXPForLevel = (level) => {
    let total = 0;
    for (let i = 1; i < level; i++) {
        total += xpForLevel(i);
    }
    return total;
};

/**
 * Calculate level from total XP
 */
const levelFromXP = (totalXP) => {
    let level = 1;
    let xpNeeded = 0;

    while (xpNeeded <= totalXP) {
        level++;
        xpNeeded += xpForLevel(level - 1);
    }

    return level - 1;
};

/**
 * Calculate XP for speaking practice
 * @param {number} duration - Duration in seconds
 * @param {number} score - Score percentage (0-100)
 * @param {boolean} completed - Whether session was completed
 */
const calculateSpeakingXP = (duration, score = 0, completed = false) => {
    // Base XP: 10 per minute
    const minutes = duration / 60;
    let xp = Math.floor(minutes * 10);

    // Score bonus: +5 XP per 10% above 70%
    if (score >= 70) {
        const bonusMultiplier = Math.floor((score - 70) / 10);
        xp += bonusMultiplier * 5;
    }

    // Completion bonus
    if (completed) {
        xp += 20;
    }

    return Math.max(xp, 0);
};

/**
 * Calculate XP for listening practice
 * @param {number} duration - Duration in seconds
 * @param {number} accuracy - Accuracy percentage (0-100)
 * @param {boolean} completed - Whether lesson was completed
 */
const calculateListeningXP = (duration, accuracy = 0, completed = false) => {
    // Base XP: 8 per minute
    const minutes = duration / 60;
    let xp = Math.floor(minutes * 8);

    // Accuracy bonus: +5 XP per 10% above 70%
    if (accuracy >= 70) {
        const bonusMultiplier = Math.floor((accuracy - 70) / 10);
        xp += bonusMultiplier * 5;
    }

    // Lesson completion bonus
    if (completed) {
        xp += 25;
    }

    return Math.max(xp, 0);
};

/**
 * Calculate XP for vocabulary practice
 * @param {number} wordsLearned - Number of new words learned
 * @param {number} wordsReviewed - Number of words reviewed
 * @param {number} perfectRecalls - Number of perfect recalls
 */
const calculateVocabularyXP = (wordsLearned = 0, wordsReviewed = 0, perfectRecalls = 0) => {
    let xp = 0;

    // New word learned: +5 XP
    xp += wordsLearned * 5;

    // Word reviewed: +2 XP
    xp += wordsReviewed * 2;

    // Perfect recall bonus: +3 XP
    xp += perfectRecalls * 3;

    return Math.max(xp, 0);
};

/**
 * Calculate star rating based on activity count
 * @param {number} count - Number of activities/sessions/lessons
 * @param {string} type - Type of activity (speaking, listening, vocabulary)
 */
const calculateStarRating = (count, type) => {
    const thresholds = {
        speaking: [0, 10, 25, 50, 100],
        listening: [0, 10, 25, 50, 100],
        vocabulary: [0, 50, 100, 200, 500]
    };

    const levels = thresholds[type] || thresholds.speaking;

    for (let i = levels.length - 1; i >= 0; i--) {
        if (count >= levels[i]) {
            return i + 1;
        }
    }

    return 1;
};

/**
 * Calculate XP to next level
 */
const xpToNextLevel = (currentLevel, currentXP) => {
    const xpNeeded = xpForLevel(currentLevel + 1);
    return xpNeeded - currentXP;
};

module.exports = {
    xpForLevel,
    totalXPForLevel,
    levelFromXP,
    calculateSpeakingXP,
    calculateListeningXP,
    calculateVocabularyXP,
    calculateStarRating,
    xpToNextLevel
};
