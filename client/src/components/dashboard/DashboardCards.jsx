import React from 'react';
import { Link } from 'react-router-dom';

const DashboardCards = ({ fluency }) => {
  return (
    <div className="dashboard-section">
      <h2 className="section-title">Your Learning Dashboard</h2>
      <div className="feature-cards">
        <Link to="/dashboard/speaking" className="feature-card" style={{ textDecoration: 'none', color: 'inherit' }}>
          <div className="feature-icon">📢</div>
          <h3>Speaking Practice</h3>
          <p>Daily goal: 5/10 mins</p>
        </Link>
        
        <Link to="/listening" className="feature-card" style={{ textDecoration: 'none', color: 'inherit' }}>
          <div className="feature-icon">🎧</div>
          <h3>Listening Practice</h3>
          <p>New audio drills available</p>
        </Link>

        <Link to="/vocabulary" className="feature-card" style={{ textDecoration: 'none', color: 'inherit' }}>
          <div className="feature-icon">📚</div>
          <h3>Vocabulary</h3>
          <p>Build your vocabulary list</p>
        </Link>

        <div className="feature-card">
          <div className="feature-icon">📊</div>
          <h3>Your Progress</h3>
          <p>Overall fluency: {fluency}%</p>
        </div>
      </div>
    </div>
  );
};

export default DashboardCards;
