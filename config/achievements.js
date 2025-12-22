// Achievement definitions for gamification system
const achievements = [
    // Vocabulary Achievements
    {
        id: 'vocab_starter_50',
        name: 'Vocabulary Starter',
        description: 'Learn your first 50 words',
        category: 'vocabulary',
        xpReward: 50,
        requirement: { type: 'wordsLearned', value: 50 },
        icon: '📚'
    },
    {
        id: 'vocab_master_150',
        name: 'Vocabulary Master',
        description: 'Learn 150 words',
        category: 'vocabulary',
        xpReward: 150,
        requirement: { type: 'wordsLearned', value: 150 },
        icon: '📖'
    },
    {
        id: 'vocab_expert_500',
        name: 'Vocabulary Expert',
        description: 'Learn 500 words',
        category: 'vocabulary',
        xpReward: 500,
        requirement: { type: 'wordsLearned', value: 500 },
        icon: '🎓'
    },
    {
        id: 'polyglot_1000',
        name: 'Polyglot',
        description: 'Learn 1000 words',
        category: 'vocabulary',
        xpReward: 1000,
        requirement: { type: 'wordsLearned', value: 1000 },
        icon: '🌍'
    },

    // Speaking Achievements
    {
        id: 'first_words',
        name: 'First Words',
        description: 'Complete your first speaking session',
        category: 'speaking',
        xpReward: 25,
        requirement: { type: 'sessions', value: 1 },
        icon: '🎤'
    },
    {
        id: 'speaking_streak_7',
        name: 'Speaking Streak',
        description: 'Practice speaking for 7 consecutive days',
        category: 'speaking',
        xpReward: 100,
        requirement: { type: 'streak', value: 7 },
        icon: '🔥'
    },
    {
        id: 'speaking_marathon_50',
        name: 'Speaking Marathon',
        description: 'Complete 50 speaking sessions',
        category: 'speaking',
        xpReward: 250,
        requirement: { type: 'sessions', value: 50 },
        icon: '🏃'
    },
    {
        id: 'perfect_score',
        name: 'Perfect Score',
        description: 'Achieve 100% accuracy in a session',
        category: 'speaking',
        xpReward: 150,
        requirement: { type: 'perfectScore', value: 100 },
        icon: '⭐'
    },

    // Listening Achievements
    {
        id: 'listening_enthusiast_10',
        name: 'Listening Enthusiast',
        description: 'Complete 10 listening lessons',
        category: 'listening',
        xpReward: 75,
        requirement: { type: 'lessonsCompleted', value: 10 },
        icon: '🎧'
    },
    {
        id: 'listening_master_50',
        name: 'Listening Master',
        description: 'Complete 50 listening lessons',
        category: 'listening',
        xpReward: 300,
        requirement: { type: 'lessonsCompleted', value: 50 },
        icon: '🎵'
    },
    {
        id: 'perfect_listener',
        name: 'Perfect Listener',
        description: 'Achieve 100% accuracy in a lesson',
        category: 'listening',
        xpReward: 200,
        requirement: { type: 'perfectAccuracy', value: 100 },
        icon: '👂'
    },

    // Streak Achievements
    {
        id: 'week_warrior',
        name: 'Week Warrior',
        description: 'Maintain a 7-day streak',
        category: 'streak',
        xpReward: 100,
        requirement: { type: 'streak', value: 7 },
        icon: '🔥'
    },
    {
        id: 'month_master',
        name: 'Month Master',
        description: 'Maintain a 30-day streak',
        category: 'streak',
        xpReward: 500,
        requirement: { type: 'streak', value: 30 },
        icon: '🏆'
    },
    {
        id: 'year_champion',
        name: 'Year Champion',
        description: 'Maintain a 365-day streak',
        category: 'streak',
        xpReward: 5000,
        requirement: { type: 'streak', value: 365 },
        icon: '👑'
    },

    // Overall Achievements
    {
        id: 'dedicated_learner',
        name: 'Dedicated Learner',
        description: 'Complete 100 total activities',
        category: 'overall',
        xpReward: 300,
        requirement: { type: 'totalActivities', value: 100 },
        icon: '💪'
    },
    {
        id: 'time_master',
        name: 'Time Master',
        description: 'Practice for 50 hours total',
        category: 'overall',
        xpReward: 400,
        requirement: { type: 'totalTime', value: 180000 }, // 50 hours in seconds
        icon: '⏰'
    }
];

module.exports = achievements;
