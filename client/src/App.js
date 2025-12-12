import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Home from './pages/Home';
import LoginPage from './pages/LoginPage';
import SignUpPage from './pages/SignUpPage';
import DashboardPage from './pages/DashboardPage';
import VocabularyPage from './pages/VocabularyPage';
import CourseDetailPage from './pages/CourseDetailPage';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/signup" element={<SignUpPage />} />
        <Route path="/dashboard" element={<DashboardPage />} />
        <Route path="/vocabulary" element={<VocabularyPage />} />
        <Route path="/course/:id" element={<CourseDetailPage />} />
      </Routes>
    </Router>
  );
}

export default App;

