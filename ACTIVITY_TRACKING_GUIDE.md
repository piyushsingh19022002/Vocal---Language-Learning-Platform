# Activity Tracking Integration Guide

This guide shows how to integrate activity tracking into Speaking Practice, Listening, and Vocabulary components.

## Speaking Practice Integration

Add to `/Users/sunnytyagi/Downloads/LLP/client/src/components/SpeakingPractice.js`:

### 1. Import the activity tracker
```javascript
import { activityTracker } from '../utils/activityTracker';
```

### 2. Start tracking when user begins practice
```javascript
// When user starts a speaking session (e.g., when they select a level and start)
useEffect(() => {
  if (language && learningLanguage && category && selectedLevel) {
    activityTracker.startSession('speaking', {
      language: learningLanguage,
      category: category,
      level: selectedLevel
    });
  }
}, [language, learningLanguage, category, selectedLevel]);
```

### 3. End tracking when session completes
```javascript
// When user completes the speaking practice
const handleComplete = async (finalScore) => {
  try {
    await activityTracker.endSession({
      score: finalScore,
      completed: true
    });
    console.log('Activity logged successfully!');
  } catch (error) {
    console.error('Failed to log activity:', error);
  }
};
```

### 4. Handle cleanup on unmount
```javascript
// Clean up if user leaves before completing
useEffect(() => {
  return () => {
    if (activityTracker.hasActiveSession()) {
      activityTracker.endSession({ completed: false });
    }
  };
}, []);
```

---

## Vocabulary Integration

For vocabulary practice, track when users learn new words:

```javascript
import { activityTracker } from '../utils/activityTracker';

// Start session when component mounts
useEffect(() => {
  activityTracker.startSession('vocabulary', {
    language: selectedLanguage
  });
  
  return () => {
    if (activityTracker.hasActiveSession()) {
      activityTracker.endSession({ completed: false });
    }
  };
}, []);

// When user learns words
const handleWordsLearned = async (count) => {
  activityTracker.updateDetails({
    wordsLearned: count
  });
};

// When session ends
const handleEndSession = async () => {
  await activityTracker.endSession({
    wordsLearned: learnedWordsCount,
    wordsReviewed: reviewedWordsCount
  });
};
```

---

## Listening Integration

For listening practice:

```javascript
import { activityTracker } from '../utils/activityTracker';

// Start when lesson begins
const startLesson = (lessonId) => {
  activityTracker.startSession('listening', {
    lessonId: lessonId
  });
};

// End when lesson completes
const completeLesson = async (accuracy) => {
  await activityTracker.endSession({
    accuracy: accuracy,
    completed: true
  });
};
```

---

## Quick Integration Example

Here's a minimal example for any component:

```javascript
import { activityTracker } from '../utils/activityTracker';

function MyPracticeComponent() {
  useEffect(() => {
    // Start tracking
    activityTracker.startSession('speaking', { level: 'beginner' });
    
    // Cleanup on unmount
    return () => {
      if (activityTracker.hasActiveSession()) {
        activityTracker.endSession({ completed: false });
      }
    };
  }, []);
  
  const handleFinish = async () => {
    // End tracking with results
    await activityTracker.endSession({
      score: 85,
      completed: true
    });
  };
  
  return (
    <div>
      {/* Your component UI */}
      <button onClick={handleFinish}>Finish</button>
    </div>
  );
}
```

---

## Testing the Integration

1. **Start a speaking/listening/vocabulary session**
2. **Complete the session**
3. **Go to Dashboard**
4. **Check the Weekly Activity card** - it should show:
   - Total practice time
   - Number of sessions per activity type
   - Average scores/accuracy
   - Words learned

---

## API Endpoints Available

- `POST /api/activity` - Log a new activity
- `GET /api/activity/weekly` - Get weekly summary
- `GET /api/activity/all?limit=50&skip=0` - Get all activities (paginated)

---

## Activity Data Structure

```javascript
{
  activityType: 'speaking' | 'listening' | 'vocabulary' | 'course',
  duration: 300, // in seconds
  details: {
    // For speaking
    language: 'French',
    category: 'Greeting',
    level: 'Beginner',
    score: 85,
    
    // For vocabulary
    wordsLearned: 10,
    wordsReviewed: 5,
    
    // For listening
    lessonId: '507f1f77bcf86cd799439011',
    accuracy: 90,
    
    // Common
    completed: true
  }
}
```

---

## Notes

- Activity tracking is **automatic** once integrated
- Sessions are tracked in **seconds** on the backend
- Dashboard displays time in **minutes**
- Failed sessions (user leaves early) are still logged with `completed: false`
- The tracker handles **one session at a time** per component
