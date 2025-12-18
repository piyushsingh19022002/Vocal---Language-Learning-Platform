import React from 'react';

const DashboardStats = ({ user }) => {
  const fluency = user?.progress?.get('French')?.fluency || 0;
  const practiceTime = user?.practiceTime || 0;

  return (
    <div className="activity-section">
      <div className="activity-card">
        <div 
          className="progress-circle" 
          style={{ '--progress': `${fluency}%` }}
        >
          <div className="progress-content">
            <div className="progress-value">{fluency}%</div>
            <div className="progress-label">Fluency</div>
          </div>
        </div>
        <div className="activity-content">
          <h3>Weekly Activity</h3>
          <p>
            Great job this week, {user?.name || 'User'}! You've practiced
            for {practiceTime} minutes. Keep up the momentum.
          </p>
          <button className="btn-report">View Detailed Report</button>
        </div>
      </div>
    </div>
  );
};

export default DashboardStats;
