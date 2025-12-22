const mongoose = require('mongoose');
const dotenv = require('dotenv');
const Course = require('../models/Course');
const Lesson = require('../models/Lesson');

dotenv.config();

const connectDB = require('../config/db');

const seedBasicEnglishFoundations = async () => {
  try {
    await connectDB();
    console.log('Connected to MongoDB');

    // Check if course already exists
    const existingCourse = await Course.findOne({ name: 'Basic English Foundations' });
    if (existingCourse) {
      console.log('Course "Basic English Foundations" already exists. Skipping seed.');
      process.exit(0);
    }

    // Create the main course
    const course = await Course.create({
      name: 'Basic English Foundations',
      language: 'English',
      description: 'A comprehensive beginner course covering essential English fundamentals including alphabet, greetings, numbers, basic grammar, and everyday vocabulary. Perfect for absolute beginners starting their English learning journey.',
      level: 'Beginner',
      studentsEnrolled: 0,
      image: '🇬🇧'
    });

    console.log('Created course:', course.name);

    // Learning outcomes for the course
    const courseLearningOutcomes = [
      'Master the English alphabet and pronunciation',
      'Learn common greetings and introduction phrases',
      'Understand numbers, days, and months',
      'Grasp basic grammar concepts (nouns, verbs, adjectives)',
      'Build a foundation of 50+ everyday vocabulary words'
    ];

    const defaultAiPrompts = [
      'Ask AI anything about this topic',
      'Explain this concept again',
      'Generate more examples for me',
      'Test me with a quiz',
      'Create a practice conversation'
    ];

    // Lesson 1: Alphabet & Pronunciation
    const lesson1 = await Lesson.create({
      title: 'Alphabet & Pronunciation',
      course: course._id,
      type: 'Speaking',
      description: 'Learn the English alphabet from A to Z with proper pronunciation and example words for each letter.',
      order: 1,
      learningOutcomes: [
        'Recognize all 26 letters of the English alphabet',
        'Understand basic pronunciation rules',
        'Learn example words for each letter'
      ],
      renderActions: true,
      aiPrompts: defaultAiPrompts,
      sections: [
        {
          title: 'The English Alphabet',
          content: 'The English alphabet consists of 26 letters: 5 vowels (A, E, I, O, U) and 21 consonants. Each letter has a name and a sound.',
          examples: [
            { text: 'A - Apple', explanation: 'The letter A sounds like "ay" as in "apple"' },
            { text: 'B - Ball', explanation: 'The letter B sounds like "bee" as in "ball"' }
          ]
        },
        {
          title: 'Vowels (A, E, I, O, U)',
          content: 'Vowels are the most important letters. They can make different sounds depending on the word.',
          examples: [
            { text: 'A: Apple, Ant, Art', explanation: 'A can sound like "ah" or "ay"' },
            { text: 'E: Egg, Elephant, End', explanation: 'E often sounds like "eh"' },
            { text: 'I: Ice, Ink, Idea', explanation: 'I can sound like "eye" or "ih"' },
            { text: 'O: Orange, Octopus, On', explanation: 'O can sound like "oh" or "aw"' },
            { text: 'U: Umbrella, Up, Use', explanation: 'U can sound like "you" or "uh"' }
          ]
        },
        {
          title: 'Consonants',
          content: 'Consonants are all the other letters. They combine with vowels to form words.',
          examples: [
            { text: 'B: Ball, Book, Big', explanation: 'B makes a "buh" sound' },
            { text: 'C: Cat, Car, Cup', explanation: 'C can sound like "k" or "s"' },
            { text: 'D: Dog, Door, Day', explanation: 'D makes a "duh" sound' },
            { text: 'F: Fish, Fun, Five', explanation: 'F makes a "fuh" sound' },
            { text: 'G: Go, Girl, Game', explanation: 'G can sound like "guh" or "juh"' },
            { text: 'H: Hat, House, Happy', explanation: 'H makes a "huh" sound' },
            { text: 'J: Jump, Joy, June', explanation: 'J makes a "juh" sound' },
            { text: 'K: Key, King, Keep', explanation: 'K makes a "kuh" sound' },
            { text: 'L: Love, Light, Like', explanation: 'L makes a "luh" sound' },
            { text: 'M: Moon, Man, Make', explanation: 'M makes a "muh" sound' },
            { text: 'N: No, Nice, Night', explanation: 'N makes a "nuh" sound' },
            { text: 'P: Pen, Play, Park', explanation: 'P makes a "puh" sound' },
            { text: 'Q: Queen, Quick, Quiet', explanation: 'Q always comes with U, sounds like "kwuh"' },
            { text: 'R: Red, Run, Read', explanation: 'R makes a "ruh" sound' },
            { text: 'S: Sun, See, Say', explanation: 'S makes a "suh" sound' },
            { text: 'T: Tree, Time, Take', explanation: 'T makes a "tuh" sound' },
            { text: 'V: Very, Voice, Visit', explanation: 'V makes a "vuh" sound' },
            { text: 'W: Water, Work, Want', explanation: 'W makes a "wuh" sound' },
            { text: 'X: Box, Six, Mix', explanation: 'X makes a "ks" or "z" sound' },
            { text: 'Y: Yes, You, Year', explanation: 'Y can be a vowel or consonant' },
            { text: 'Z: Zoo, Zero, Zone', explanation: 'Z makes a "zuh" sound' }
          ]
        }
      ],
      practiceExercises: [
        {
          question: 'Which letter comes after B?',
          type: 'multiple-choice',
          options: ['A', 'C', 'D', 'E'],
          correctAnswer: 1,
          explanation: 'C comes after B in the alphabet.'
        },
        {
          question: 'How many vowels are in the English alphabet?',
          type: 'multiple-choice',
          options: ['3', '4', '5', '6'],
          correctAnswer: 2,
          explanation: 'There are 5 vowels: A, E, I, O, U.'
        }
      ]
    });

    // Lesson 2: Greetings and Introductions
    const lesson2 = await Lesson.create({
      title: 'Greetings and Introductions',
      course: course._id,
      type: 'Speaking',
      description: 'Learn common greetings, how to introduce yourself, and basic conversation starters.',
      order: 2,
      learningOutcomes: [
        'Use appropriate greetings for different times of day',
        'Introduce yourself confidently',
        'Engage in basic introductory conversations'
      ],
      renderActions: true,
      aiPrompts: defaultAiPrompts,
      sections: [
        {
          title: 'Common Greetings',
          content: 'Greetings change based on the time of day and formality level.',
          examples: [
            { text: 'Good Morning (before 12 PM)', explanation: 'Used in the morning, formal and friendly' },
            { text: 'Good Afternoon (12 PM - 5 PM)', explanation: 'Used in the afternoon, formal' },
            { text: 'Good Evening (after 5 PM)', explanation: 'Used in the evening, formal' },
            { text: 'Hello / Hi', explanation: 'Can be used anytime, friendly and casual' },
            { text: 'Hey', explanation: 'Very casual, used with friends' },
            { text: 'Good Night', explanation: 'Used when saying goodbye at night or before sleeping' }
          ]
        },
        {
          title: 'How to Introduce Yourself',
          content: 'A good introduction includes your name, where you are from, and what you do.',
          examples: [
            { text: 'Hi, I\'m [Name].', explanation: 'Simple and friendly introduction' },
            { text: 'Hello, my name is [Name].', explanation: 'More formal introduction' },
            { text: 'Nice to meet you!', explanation: 'Response after someone introduces themselves' },
            { text: 'Pleased to meet you.', explanation: 'Formal response' }
          ]
        },
        {
          title: 'Sample Dialogues',
          content: 'Practice these common conversation patterns.',
          examples: [
            { 
              text: 'Dialogue 1:\nPerson A: Good morning!\nPerson B: Good morning! How are you?\nPerson A: I\'m fine, thank you. And you?\nPerson B: I\'m great, thanks!', 
              explanation: 'A typical morning greeting exchange' 
            },
            { 
              text: 'Dialogue 2:\nPerson A: Hi, I\'m Sarah.\nPerson B: Hello Sarah, I\'m John. Nice to meet you!\nPerson A: Nice to meet you too!', 
              explanation: 'A formal introduction exchange' 
            },
            { 
              text: 'Dialogue 3:\nPerson A: Hey! How\'s it going?\nPerson B: Pretty good! How about you?\nPerson A: Not bad, thanks!', 
              explanation: 'A casual greeting between friends' 
            }
          ]
        },
        {
          title: 'Practice Sentences',
          content: 'Use these sentences to practice your greetings.',
          examples: [
            { text: 'Good morning, teacher!', explanation: 'Greeting a teacher in the morning' },
            { text: 'Hello, my name is Maria. I\'m from Spain.', explanation: 'Introducing yourself with your origin' },
            { text: 'Nice to meet you! Where are you from?', explanation: 'Asking about someone\'s origin' },
            { text: 'Have a good day!', explanation: 'Saying goodbye during the day' },
            { text: 'See you later!', explanation: 'Casual goodbye' }
          ]
        }
      ],
      practiceExercises: [
        {
          question: 'What greeting would you use at 3 PM?',
          type: 'multiple-choice',
          options: ['Good Morning', 'Good Afternoon', 'Good Evening', 'Good Night'],
          correctAnswer: 1,
          explanation: 'Good Afternoon is used between 12 PM and 5 PM.'
        },
        {
          question: 'Complete: "Hello, my name ___ John."',
          type: 'fill-blank',
          options: ['is', 'am', 'are', 'be'],
          correctAnswer: 0,
          explanation: 'Use "is" with third person singular (my name).'
        }
      ]
    });

    // Lesson 3: Numbers, Days, Months
    const lesson3 = await Lesson.create({
      title: 'Numbers, Days, Months',
      course: course._id,
      type: 'Reading',
      description: 'Master numbers from 1-100, learn the days of the week, and months of the year with proper pronunciation.',
      order: 3,
      learningOutcomes: [
        'Count from 1 to 100',
        'Name all days of the week',
        'Identify all months of the year',
        'Use numbers in everyday contexts'
      ],
      renderActions: true,
      aiPrompts: defaultAiPrompts,
      sections: [
        {
          title: 'Numbers 1-20',
          content: 'Learn the basic numbers first. These are the foundation for all other numbers.',
          examples: [
            { text: '1 - One, 2 - Two, 3 - Three, 4 - Four, 5 - Five', explanation: 'First five numbers' },
            { text: '6 - Six, 7 - Seven, 8 - Eight, 9 - Nine, 10 - Ten', explanation: 'Numbers 6-10' },
            { text: '11 - Eleven, 12 - Twelve, 13 - Thirteen, 14 - Fourteen, 15 - Fifteen', explanation: 'Teen numbers start here' },
            { text: '16 - Sixteen, 17 - Seventeen, 18 - Eighteen, 19 - Nineteen, 20 - Twenty', explanation: 'More teen numbers' }
          ]
        },
        {
          title: 'Numbers 21-100',
          content: 'After 20, numbers follow a pattern. Learn the tens (20, 30, 40, etc.) and combine them.',
          examples: [
            { text: '20 - Twenty, 30 - Thirty, 40 - Forty, 50 - Fifty', explanation: 'Tens pattern' },
            { text: '60 - Sixty, 70 - Seventy, 80 - Eighty, 90 - Ninety, 100 - One Hundred', explanation: 'More tens' },
            { text: '21 - Twenty-one, 32 - Thirty-two, 45 - Forty-five', explanation: 'Combining tens and ones' },
            { text: 'Examples: 25 (twenty-five), 67 (sixty-seven), 89 (eighty-nine)', explanation: 'More examples of combined numbers' }
          ]
        },
        {
          title: 'Days of the Week',
          content: 'There are 7 days in a week. Learn them in order.',
          examples: [
            { text: 'Monday - The first day of the work week', explanation: 'Mon-day' },
            { text: 'Tuesday - The second day', explanation: 'Tues-day' },
            { text: 'Wednesday - The middle of the week', explanation: 'Wed-nes-day' },
            { text: 'Thursday - The fourth day', explanation: 'Thurs-day' },
            { text: 'Friday - The last work day', explanation: 'Fri-day' },
            { text: 'Saturday - Weekend begins', explanation: 'Sat-ur-day' },
            { text: 'Sunday - The last day of the week', explanation: 'Sun-day' }
          ]
        },
        {
          title: 'Months of the Year',
          content: 'There are 12 months in a year. Learn them in order.',
          examples: [
            { text: 'January - The first month', explanation: 'Jan-u-ary' },
            { text: 'February - The second month', explanation: 'Feb-ru-ary' },
            { text: 'March - Spring begins', explanation: 'March' },
            { text: 'April - Spring month', explanation: 'A-pril' },
            { text: 'May - Late spring', explanation: 'May' },
            { text: 'June - Early summer', explanation: 'June' },
            { text: 'July - Summer month', explanation: 'Ju-ly' },
            { text: 'August - Late summer', explanation: 'Au-gust' },
            { text: 'September - Fall begins', explanation: 'Sep-tem-ber' },
            { text: 'October - Fall month', explanation: 'Oc-to-ber' },
            { text: 'November - Late fall', explanation: 'No-vem-ber' },
            { text: 'December - Winter begins', explanation: 'De-cem-ber' }
          ]
        }
      ],
      practiceExercises: [
        {
          question: 'What comes after Wednesday?',
          type: 'multiple-choice',
          options: ['Monday', 'Tuesday', 'Thursday', 'Friday'],
          correctAnswer: 2,
          explanation: 'Thursday comes after Wednesday.'
        },
        {
          question: 'How do you write 47 in words?',
          type: 'multiple-choice',
          options: ['Four-seven', 'Forty-seven', 'Fourty-seven', 'Forty seven'],
          correctAnswer: 1,
          explanation: '47 is written as "forty-seven" with a hyphen.'
        },
        {
          question: 'Which month comes before May?',
          type: 'multiple-choice',
          options: ['March', 'April', 'June', 'July'],
          correctAnswer: 1,
          explanation: 'April comes before May.'
        }
      ]
    });

    // Lesson 4: Basic Grammar (Nouns, Verbs, Adjectives)
    const lesson4 = await Lesson.create({
      title: 'Basic Grammar (Nouns, Verbs, Adjectives)',
      course: course._id,
      type: 'Reading',
      description: 'Learn the fundamental parts of speech: nouns, verbs, and adjectives with examples and simple sentence formation.',
      order: 4,
      learningOutcomes: [
        'Identify and use nouns correctly',
        'Understand what verbs are and how to use them',
        'Recognize and use adjectives to describe',
        'Form simple sentences'
      ],
      renderActions: true,
      aiPrompts: defaultAiPrompts,
      sections: [
        {
          title: 'What is a Noun?',
          content: 'A noun is a word that names a person, place, thing, or idea. Nouns are the building blocks of sentences.',
          examples: [
            { text: 'Person: teacher, student, doctor, friend', explanation: 'Nouns that name people' },
            { text: 'Place: school, home, park, city', explanation: 'Nouns that name places' },
            { text: 'Thing: book, car, table, phone', explanation: 'Nouns that name objects' },
            { text: 'Idea: love, happiness, freedom, peace', explanation: 'Nouns that name concepts' },
            { text: 'Examples in sentences:\n- The teacher is kind.\n- I go to school.\n- The book is on the table.', explanation: 'Nouns used in sentences' }
          ]
        },
        {
          title: '10 Common Nouns',
          content: 'Here are 10 essential nouns you should know:',
          examples: [
            { text: '1. Cat - A small furry animal', explanation: 'The cat is sleeping.' },
            { text: '2. House - A place where people live', explanation: 'I live in a big house.' },
            { text: '3. Water - A liquid we drink', explanation: 'I drink water every day.' },
            { text: '4. Food - What we eat', explanation: 'The food is delicious.' },
            { text: '5. Friend - A person you like', explanation: 'My friend is nice.' },
            { text: '6. Car - A vehicle', explanation: 'The car is red.' },
            { text: '7. School - A place of learning', explanation: 'I go to school.' },
            { text: '8. Book - Something you read', explanation: 'I read a book.' },
            { text: '9. Phone - A device for calling', explanation: 'My phone is new.' },
            { text: '10. Time - A measurement', explanation: 'What time is it?' }
          ]
        },
        {
          title: 'What is a Verb?',
          content: 'A verb is a word that shows an action or a state of being. Verbs tell us what someone or something does.',
          examples: [
            { text: 'Action verbs: run, jump, eat, sleep, read, write', explanation: 'Verbs that show physical actions' },
            { text: 'State verbs: be, have, like, know, want', explanation: 'Verbs that show states or feelings' },
            { text: 'Examples:\n- I run every morning. (action)\n- She is happy. (state)\n- They eat lunch. (action)', explanation: 'Verbs in sentences' }
          ]
        },
        {
          title: '10 Common Verbs',
          content: 'Here are 10 essential verbs you should know:',
          examples: [
            { text: '1. Be (am, is, are) - To exist', explanation: 'I am a student.' },
            { text: '2. Have - To possess', explanation: 'I have a book.' },
            { text: '3. Do - To perform an action', explanation: 'I do my homework.' },
            { text: '4. Go - To move', explanation: 'I go to school.' },
            { text: '5. Come - To arrive', explanation: 'Come here, please.' },
            { text: '6. See - To look at', explanation: 'I see a bird.' },
            { text: '7. Know - To understand', explanation: 'I know the answer.' },
            { text: '8. Get - To receive', explanation: 'I get a letter.' },
            { text: '9. Make - To create', explanation: 'I make breakfast.' },
            { text: '10. Take - To grab', explanation: 'Take this book.' }
          ]
        },
        {
          title: 'What is an Adjective?',
          content: 'An adjective is a word that describes a noun. It tells us what kind, how many, or which one.',
          examples: [
            { text: 'Size: big, small, large, tiny', explanation: 'Adjectives describing size' },
            { text: 'Color: red, blue, green, yellow', explanation: 'Adjectives describing color' },
            { text: 'Feeling: happy, sad, angry, excited', explanation: 'Adjectives describing emotions' },
            { text: 'Examples:\n- The big dog (describes size)\n- A red car (describes color)\n- A happy child (describes feeling)', explanation: 'Adjectives in sentences' }
          ]
        },
        {
          title: '10 Common Adjectives',
          content: 'Here are 10 essential adjectives you should know:',
          examples: [
            { text: '1. Good - Positive quality', explanation: 'This is a good book.' },
            { text: '2. Bad - Negative quality', explanation: 'That was a bad movie.' },
            { text: '3. Big - Large size', explanation: 'I have a big house.' },
            { text: '4. Small - Little size', explanation: 'The cat is small.' },
            { text: '5. Happy - Feeling joy', explanation: 'I am happy.' },
            { text: '6. Sad - Feeling sorrow', explanation: 'She looks sad.' },
            { text: '7. New - Not old', explanation: 'I have a new phone.' },
            { text: '8. Old - Not new', explanation: 'This is an old car.' },
            { text: '9. Hot - High temperature', explanation: 'The water is hot.' },
            { text: '10. Cold - Low temperature', explanation: 'The ice is cold.' }
          ]
        },
        {
          title: 'Simple Sentence Formation',
          content: 'A simple sentence has a subject (noun) and a predicate (verb). You can add adjectives to make it more interesting.',
          examples: [
            { text: 'Basic: Subject + Verb\n- The cat sleeps.\n- I eat.', explanation: 'Simple subject-verb sentences' },
            { text: 'With Adjective: Subject + Adjective + Verb\n- The big cat sleeps.\n- I eat good food.', explanation: 'Adding adjectives' },
            { text: 'Complete: Subject + Verb + Object\n- The cat eats food.\n- I read a book.', explanation: 'Adding objects' },
            { text: 'Full: Subject + Adjective + Verb + Object\n- The big cat eats good food.\n- I read an interesting book.', explanation: 'Complete sentences with all parts' }
          ]
        }
      ],
      practiceExercises: [
        {
          question: 'Which word is a noun?',
          type: 'multiple-choice',
          options: ['run', 'happy', 'book', 'quickly'],
          correctAnswer: 2,
          explanation: 'Book is a noun (a thing). Run is a verb, happy is an adjective, quickly is an adverb.'
        },
        {
          question: 'Which word is a verb?',
          type: 'multiple-choice',
          options: ['table', 'jump', 'beautiful', 'slowly'],
          correctAnswer: 1,
          explanation: 'Jump is a verb (an action). Table is a noun, beautiful is an adjective, slowly is an adverb.'
        },
        {
          question: 'Complete: "The ___ dog runs." (Choose an adjective)',
          type: 'multiple-choice',
          options: ['run', 'quickly', 'fast', 'runs'],
          correctAnswer: 2,
          explanation: 'Fast is an adjective that describes the dog. Run and runs are verbs, quickly is an adverb.'
        }
      ]
    });

    // Lesson 5: Everyday Vocabulary
    const lesson5 = await Lesson.create({
      title: 'Everyday Vocabulary',
      course: course._id,
      type: 'Vocabulary',
      description: 'Learn 50 essential words you\'ll use every day in English conversations and daily life.',
      order: 5,
      learningOutcomes: [
        'Master 50 essential daily-use words',
        'Use vocabulary in context with example sentences',
        'Build confidence in everyday conversations'
      ],
      renderActions: true,
      aiPrompts: defaultAiPrompts,
      sections: [
        {
          title: 'Essential Daily Words (1-10)',
          content: 'These are the most common words you\'ll hear and use every day.',
          examples: [
            { text: '1. Hello - A greeting', explanation: 'Hello, how are you?' },
            { text: '2. Please - Polite request', explanation: 'Please help me.' },
            { text: '3. Thank you - Showing gratitude', explanation: 'Thank you very much!' },
            { text: '4. Yes - Agreement', explanation: 'Yes, I understand.' },
            { text: '5. No - Disagreement', explanation: 'No, thank you.' },
            { text: '6. Sorry - Apology', explanation: 'Sorry, I\'m late.' },
            { text: '7. Excuse me - Getting attention', explanation: 'Excuse me, where is the bathroom?' },
            { text: '8. Goodbye - Farewell', explanation: 'Goodbye, see you tomorrow!' },
            { text: '9. Water - Essential drink', explanation: 'Can I have some water?' },
            { text: '10. Food - What we eat', explanation: 'The food is delicious.' }
          ]
        },
        {
          title: 'Essential Daily Words (11-20)',
          content: 'More words for daily communication.',
          examples: [
            { text: '11. Time - Measurement of moments', explanation: 'What time is it?' },
            { text: '12. Day - 24-hour period', explanation: 'Have a good day!' },
            { text: '13. Night - Evening time', explanation: 'Good night!' },
            { text: '14. Morning - Early part of day', explanation: 'Good morning!' },
            { text: '15. Today - This day', explanation: 'What are you doing today?' },
            { text: '16. Tomorrow - Next day', explanation: 'See you tomorrow!' },
            { text: '17. Yesterday - Previous day', explanation: 'I went there yesterday.' },
            { text: '18. Now - Present moment', explanation: 'I am busy now.' },
            { text: '19. Here - This place', explanation: 'Come here, please.' },
            { text: '20. There - That place', explanation: 'The book is there.' }
          ]
        },
        {
          title: 'Essential Daily Words (21-30)',
          content: 'Words for describing and asking.',
          examples: [
            { text: '21. What - Question word', explanation: 'What is your name?' },
            { text: '22. Where - Location question', explanation: 'Where are you from?' },
            { text: '23. When - Time question', explanation: 'When do you arrive?' },
            { text: '24. Who - Person question', explanation: 'Who is that?' },
            { text: '25. Why - Reason question', explanation: 'Why are you here?' },
            { text: '26. How - Manner question', explanation: 'How are you?' },
            { text: '27. Good - Positive quality', explanation: 'That\'s a good idea.' },
            { text: '28. Bad - Negative quality', explanation: 'That\'s a bad idea.' },
            { text: '29. Big - Large size', explanation: 'I have a big family.' },
            { text: '30. Small - Little size', explanation: 'This is a small room.' }
          ]
        },
        {
          title: 'Essential Daily Words (31-40)',
          content: 'Words for people and relationships.',
          examples: [
            { text: '31. Friend - Companion', explanation: 'She is my best friend.' },
            { text: '32. Family - Relatives', explanation: 'I love my family.' },
            { text: '33. Home - Where you live', explanation: 'I go home after school.' },
            { text: '34. School - Place of learning', explanation: 'I study at school.' },
            { text: '35. Work - Job or task', explanation: 'I go to work every day.' },
            { text: '36. Help - Assistance', explanation: 'Can you help me?' },
            { text: '37. Need - Requirement', explanation: 'I need your help.' },
            { text: '38. Want - Desire', explanation: 'I want to learn English.' },
            { text: '39. Like - Preference', explanation: 'I like coffee.' },
            { text: '40. Love - Strong affection', explanation: 'I love my family.' }
          ]
        },
        {
          title: 'Essential Daily Words (41-50)',
          content: 'Words for actions and common activities.',
          examples: [
            { text: '41. Eat - To consume food', explanation: 'I eat breakfast at 8 AM.' },
            { text: '42. Drink - To consume liquid', explanation: 'I drink water every day.' },
            { text: '43. Sleep - To rest', explanation: 'I sleep 8 hours every night.' },
            { text: '44. Go - To move', explanation: 'I go to school by bus.' },
            { text: '45. Come - To arrive', explanation: 'Come here, please.' },
            { text: '46. See - To look', explanation: 'I see a beautiful bird.' },
            { text: '47. Know - To understand', explanation: 'I know the answer.' },
            { text: '48. Think - To consider', explanation: 'I think it\'s a good idea.' },
            { text: '49. Say - To speak', explanation: 'What did you say?' },
            { text: '50. Do - To perform', explanation: 'What do you do?' }
          ]
        }
      ],
      practiceExercises: [
        {
          question: 'Which word means "showing gratitude"?',
          type: 'multiple-choice',
          options: ['Hello', 'Please', 'Thank you', 'Sorry'],
          correctAnswer: 2,
          explanation: 'Thank you is used to show gratitude or appreciation.'
        },
        {
          question: 'Complete: "___ is your name?"',
          type: 'fill-blank',
          options: ['What', 'Where', 'When', 'Who'],
          correctAnswer: 0,
          explanation: 'What is used to ask about things or information.'
        },
        {
          question: 'Which word is an action word?',
          type: 'multiple-choice',
          options: ['Friend', 'Home', 'Eat', 'Good'],
          correctAnswer: 2,
          explanation: 'Eat is a verb (action word). Friend and home are nouns, good is an adjective.'
        }
      ]
    });

    // Update course with lessons
    course.lessons = [lesson1._id, lesson2._id, lesson3._id, lesson4._id, lesson5._id];
    await course.save();

    console.log('✅ Successfully created course with 5 lessons!');
    console.log(`Course: ${course.name}`);
    console.log(`Lessons created: ${course.lessons.length}`);
    console.log('Lessons:');
    console.log(`  1. ${lesson1.title}`);
    console.log(`  2. ${lesson2.title}`);
    console.log(`  3. ${lesson3.title}`);
    console.log(`  4. ${lesson4.title}`);
    console.log(`  5. ${lesson5.title}`);

    process.exit(0);
  } catch (error) {
    console.error('Error seeding course:', error);
    process.exit(1);
  }
};

// Run the seed function
seedBasicEnglishFoundations();

