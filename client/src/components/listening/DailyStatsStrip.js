import React from 'react';
import './DailyStatsStrip.css';

const DailyStatsStrip = ({ stats }) => {
  return (
    <div className="daily-stats-strip">
      <div className="stats-strip-container">
        <div className="stat-item">
          <div className="stat-icon">🎧</div>
          <div className="stat-content">
            <div className="stat-value">{stats.listeningTime || 0}</div>
            <div className="stat-label">Minutes Today</div>
          </div>
        </div>

        <div className="stat-item">
          <div className="stat-icon">📖</div>
          <div className="stat-content">
            <div className="stat-value">{stats.lessonsCompleted || 0}</div>
            <div className="stat-label">Lessons Completed</div>
          </div>
        </div>

        <div className="stat-item">
          <div className="stat-icon">✍️</div>
          <div className="stat-content">
            <div className="stat-value">{stats.practicesCompleted || 0}</div>
            <div className="stat-label">Text Practices</div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DailyStatsStrip;

