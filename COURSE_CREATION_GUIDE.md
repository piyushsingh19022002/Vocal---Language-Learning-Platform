# Course Creation Guide

## Method 1: Using the Seed Script (Recommended for First Course)

### Step 1: Run the Seed Script

From the root directory of your project, run:

```bash
npm run seed
```

This will create the "Basic English Foundations" course with 5 lessons automatically.

**What it does:**
- Creates the main course: "Basic English Foundations"
- Creates 5 lessons with detailed content:
  1. Alphabet & Pronunciation
  2. Greetings and Introductions
  3. Numbers, Days, Months
  4. Basic Grammar (Nouns, Verbs, Adjectives)
  5. Everyday Vocabulary

**Note:** The script checks if the course already exists and won't create duplicates.

---

## Method 2: Create Courses via API (For Additional Courses)

### Option A: Using Postman or API Client

1. **Start your backend server:**
   ```bash
   npm start
   # or
   npm run dev
   ```

2. **Login to get a token:**
   ```bash
   POST http://localhost:5001/api/auth/login
   Body: {
     "email": "your-email@example.com",
     "password": "your-password"
   }
   ```

3. **Create a course:**
   ```bash
   POST http://localhost:5001/api/courses
   Headers: {
     "Authorization": "Bearer YOUR_TOKEN_HERE",
     "Content-Type": "application/json"
   }
   Body: {
     "name": "Course Name",
     "language": "English",
     "description": "Course description here",
     "level": "Beginner",
     "image": "🇬🇧"
   }
   ```

4. **Create lessons for the course:**
   ```bash
   POST http://localhost:5001/api/lessons
   Headers: {
     "Authorization": "Bearer YOUR_TOKEN_HERE",
     "Content-Type": "application/json"
   }
   Body: {
     "title": "Lesson Title",
     "course": "COURSE_ID_FROM_STEP_3",
     "type": "Speaking",
     "description": "Lesson description",
     "order": 1,
     "learningOutcomes": ["Outcome 1", "Outcome 2"],
     "sections": [
       {
         "title": "Section Title",
         "content": "Section content here",
         "examples": [
           {
             "text": "Example text",
             "explanation": "Explanation here"
           }
         ]
       }
     ],
     "practiceExercises": [
       {
         "question": "Question text?",
         "type": "multiple-choice",
         "options": ["Option A", "Option B", "Option C", "Option D"],
         "correctAnswer": 0,
         "explanation": "Explanation here"
       }
     ]
   }
   ```

---

## Method 3: Modify the Seed Script (For Multiple Courses)

You can modify `scripts/seedCourses.js` to add more courses:

1. **Open the seed script:**
   ```bash
   code scripts/seedCourses.js
   ```

2. **Add a new course function** (similar to `seedBasicEnglishFoundations`)

3. **Call it in the script** at the bottom

4. **Run the seed script:**
   ```bash
   npm run seed
   ```

---

## Course Structure

### Course Fields:
- `name` (String, required) - Course name
- `language` (String, required) - Language of the course
- `description` (String, required) - Course description
- `level` (String) - "Beginner", "Intermediate", or "Advanced"
- `image` (String) - Emoji or image URL
- `studentsEnrolled` (Number) - Auto-incremented

### Lesson Fields:
- `title` (String, required) - Lesson title
- `course` (ObjectId, required) - Reference to course
- `type` (String, required) - "Listening", "Speaking", "Reading", "Writing", or "Vocabulary"
- `description` (String) - Lesson description
- `order` (Number) - Order in the course (1, 2, 3...)
- `learningOutcomes` (Array) - Array of learning outcomes
- `sections` (Array) - Structured content sections
  - `title` (String)
  - `content` (String)
  - `examples` (Array)
    - `text` (String)
    - `explanation` (String)
- `practiceExercises` (Array) - Practice questions
  - `question` (String)
  - `type` (String) - "multiple-choice", "fill-blank", "matching", "true-false"
  - `options` (Array)
  - `correctAnswer` (Number)
  - `explanation` (String)

---

## Quick Start

1. **Make sure MongoDB is running**
2. **Run the seed script:**
   ```bash
   npm run seed
   ```
3. **Check your Dashboard** - The course should appear in "Available Courses"
4. **Click on the course** to view details and lessons

---

## Troubleshooting

**Error: "Cannot find module '../config/db'"**
- Make sure you're running the script from the root directory

**Error: "MongoDB connection failed"**
- Check your `.env` file has `MONGODB_URI` set correctly
- Make sure MongoDB is running

**Course not appearing in Dashboard**
- Refresh the page
- Check browser console for errors
- Verify the API is returning courses: `GET http://localhost:5001/api/courses`

---

## Next Steps

After creating your first course:
1. View it in the Dashboard
2. Click to expand and see lesson previews
3. Click "Learn More" to see the full course detail page
4. Click lessons in the sidebar to view detailed content

