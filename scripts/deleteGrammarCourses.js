const mongoose = require('mongoose');
const dotenv = require('dotenv');
const Course = require('../models/Course');
const Lesson = require('../models/Lesson');

dotenv.config();
const connectDB = require('../config/db');

const deleteGrammarCourses = async () => {
    try {
        await connectDB();
        console.log('Connected to MongoDB');

        const courseNames = [
            'Parts of Speech Mastery',
            'Tenses Mastery',
            'Sentence Structure Excellence',
            'Articles and Determiners',
            'Subject-Verb Agreement',
            'Modal Verbs Mastery',
            'Passive Voice Proficiency',
            'Conditionals and Wishes',
            'Reported Speech and Questions',
            'Advanced Grammar Refinement'
        ];

        console.log('\n🗑️  Deleting existing grammar courses...\n');

        for (const courseName of courseNames) {
            const course = await Course.findOne({ name: courseName });
            if (course) {
                // Delete all lessons for this course
                await Lesson.deleteMany({ course: course._id });
                // Delete the course
                await Course.findByIdAndDelete(course._id);
                console.log(`✓ Deleted: ${courseName}`);
            } else {
                console.log(`  (Not found: ${courseName})`);
            }
        }

        console.log('\n✅ Cleanup completed!\n');
        process.exit(0);
    } catch (error) {
        console.error('❌ Error deleting courses:', error);
        process.exit(1);
    }
};

deleteGrammarCourses();
