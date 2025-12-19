# Vocal – Language Learning Platform

Vocal is a modern, listening-focused language learning platform designed to help users master new languages through immersive audio lessons, interactive practice, and comprehensive progress tracking. Unlike traditional text-heavy platforms, Vocal prioritizes listening and speaking skills to build natural fluency.

---

## 🎧 Key Features

### 🔐 Authentication & Security
- **Secure Registration**: User sign-up with email verification via OTP (One-Time Password) to ensure genuine accounts.
- **Protected Access**: Login is restricted until the email is verified.
- **JWT Authentication**: Secure, token-based session management.
- **Role-Based Access Control**: Distinct features for normal Users and Admins.

### 🎧 Listening Module
- **Listening Hub**: A centralized, modern interface for all listening activities.
- **Guided Lessons**: Structured audio lessons categorized by level (Beginner to Advanced) and topic (Story, Conversation, etc.).
- **Text-to-Speech Practice**: Interactive practice using advanced TTS to improve listening comprehension for any text.
- **Smart Tracking**: Automatic tracking of listening minutes and completed lessons.
- **Vocabulary Extraction**: Save words directly from listening exercises to your vocabulary list.
> *Note: A legacy listening practice view exists for backward compatibility but is being deprecated in favor of the new Listening Hub.*

### 🗣 Speaking Practice
- **Interactive Practice**: Dedicated module for practicing pronunciation and speaking skills.
- **Activity Tracking**: log speaking duration to maintain daily streaks.
- **Goal Setting**: Set and track daily practice goals to stay motivated.

### 📖 Vocabulary Builder
- **Personalized Word Bank**: Save and manage new vocabulary words.
- **Learning Progress**: Track mastery levels for each saved word.
- **Contextual Learning**: Words can be added from various parts of the application.

### 📚 Courses System
- **Comprehensive Course Catalog**: Browse and enroll in structured language courses.
- **Lesson-Based Learning**: detailed course views with sequential lessons.
- **Progress Monitoring**: Visual progress bars for enrolled courses.

### 📊 User Dashboard
- **Learning Overview**: rich dashboard showing daily streaks, XP, and weekly activity.
- **Skill Breakdown**: Detailed stats for Listening, Speaking, and Vocabulary.
- **Skeleton Loading**: Polished UI with loading states for a smooth user experience.

### 🛠 Admin Panel
- **User Management**: Admin dashboard to view all registered users.
- **Verification Status**: Monitor user email verification status.
- **Content Control**: Admins can manage course access and view platform-wide statistics.

---

## 🏗 Tech Architecture

Vocal is built on the robust MERN stack, ensuring scalability and performance.

- **Frontend**: **React.js** (v18) with React Router for navigation and structured component architecture.
- **Backend**: **Node.js** & **Express.js** RESTful API.
- **Database**: **MongoDB** with Mongoose for schema modeling.
- **Authentication**: JSON Web Tokens (JWT) for stateless auth and standard crypto libraries for OTP generation.

---

## 📂 Project Structure Overview

```
Vocal/
├── client/                 # React Frontend Application
│   ├── src/
│   │   ├── components/     # Reusable UI components (Header, Dashboard, Listening...)
│   │   ├── pages/          # Main view controllers (Home, Listenhub, Admin...)
│   │   ├── utils/          # API helpers and logic
│   │   └── levels/         # Game/Level logic assets
├── server/                 # Node/Express Backend
│   ├── routes/             # API definition (Auth, Listening, Admin...)
│   ├── models/             # Database Schemas (User, ListeningLesson...)
│   ├── middleware/         # Auth & Admin protection
│   └── utils/              # Helper functions (Email sender, etc.)
└── README.md               # Project Documentation
```

---

## ⚠️ Current Limitations

- **Legacy Routes**: `ListeningPractice.jsx` is accessible but not linked in the main UI, preserved for specific legacy user flows.
- **UI Refinements**: Some mobile responsiveness improvements are ongoing.
- **Performance**: Large asset optimization (e.g., audio files) is actively being improved.

---

## 🚀 Roadmap

- [ ] **Course Certificates**: Auto-generated certificates upon course completion.
- [ ] **Advanced Analytics**: Deeper insights into learning patterns and optimal practice times.
- [ ] **Recommendation Engine**: AI-driven lesson suggestions based on user mistakes.
- [ ] **Placement Test**: Initial assessment to assign appropriate difficulty levels.
- [ ] **Subscription Model**: Premium tier for advanced content and unlimited practice.
- [ ] **Gamification**: Badges, leaderboards, and extended streak rewards.

---

## 🛠 Getting Started

### Prerequisites
- Node.js (v14+)
- MongoDB (Local or Atlas URI)

### Installation

1.  **Clone the repository**
    ```bash
    git clone https://github.com/yourusername/vocal-platform.git
    cd Vocal
    ```

2.  **Install Dependencies**
    ```bash
    # Backend
    npm install
    
    # Frontend
    cd client
    npm install
    ```

3.  **Environment Variables**
    Create a `.env` file in the root directory:
    ```env
    PORT=5001
    MONGO_URI=your_mongodb_connection_string
    JWT_SECRET=your_secure_jwt_secret
    EMAIL_USER=your_email_for_otp
    EMAIL_PASS=your_email_password
    ```

4.  **Run the Application**
    ```bash
    # Terminal 1: Backend
    npm run dev
    
    # Terminal 2: Frontend
    cd client
    npm start
    ```

---

## 🤝 Contribution

We welcome contributions! Please follow these steps:
1.  Fork the repository.
2.  Create a feature branch (`git checkout -b feature/AmazingFeature`).
3.  Commit your changes (`git commit -m 'Add some AmazingFeature'`).
4.  Push to the branch (`git push origin feature/AmazingFeature`).
5.  Open a Pull Request.

---

## 📄 License

This project is open source and available under the [MIT License](LICENSE).
