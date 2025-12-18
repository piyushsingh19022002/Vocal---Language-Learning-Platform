import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Home from './pages/Home';
import LoginPage from './pages/LoginPage';
import SignUpPage from './pages/SignUpPage';
import DashboardPage from './pages/DashboardPage';
import VocabularyPage from './pages/VocabularyPage';
import ListeningPractice from './pages/ListeningPractice';
import ListeningHub from './pages/ListeningHub';
import LessonView from './components/listening/LessonView';
import LanguageSelector from './components/LanguageSelector';
import Contact from './pages/Contact';
import About from './pages/About';
import CoursesPage from './pages/CoursesPage';
import Speaking from './components/SpeakingPractice';
import GlobalProvider from './levels/globalfile';
import Level1 from './levels/level1';
import VerifyOTPPage from './pages/VerifyOTPPage';
import AdminPage from './pages/admin/AdminPage';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/signup" element={<SignUpPage />} />
        <Route path="/verify-otp" element={<VerifyOTPPage />} />
        <Route path="/dashboard" element={<DashboardPage />} />
        <Route path="/dashboard/speaking" element={<Speaking />} />
        <Route path="/dashboard/speaking/level/:id" element={<Level1 />} />
        <Route path="/vocabulary" element={<VocabularyPage />} />
        <Route path="/listening" element={<ListeningHub />} />
        <Route path="/listening-practice" element={<ListeningPractice />} />
        <Route path="/listening-practice/:id" element={<LessonView />} />
        <Route path="/contact" element={<Contact />} />
        <Route path="/about" element={<About />} />
        <Route path="/courses" element={<CoursesPage />} />
        <Route path="/admin/*" element={<AdminPage />} />
      </Routes>
    </Router>
  );
}

export default App;

