import React from 'react';

const DashboardHeader = ({ user }) => {
  return (
    <div className="welcome-section">
      <h1 className="welcome-title">
        Welcome, {user?.name || 'User'} 👋
      </h1>
      <p className="welcome-subtitle">
        Ready for your next lesson? Let's get started!
      </p>
      <button className="btn-start-lesson">
        <span className="mic-icon">🎤</span>
        Start Lesson
      </button>
    </div>
  );
};

export default DashboardHeader;
