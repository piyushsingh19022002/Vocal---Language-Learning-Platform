import React from 'react';
import './DashboardSkeleton.css';

const DashboardSkeleton = () => {
  return (
    <div className="dashboard-skeleton animate-pulse">
      <div className="dashboard-container">
        {/* Header Skeleton */}
        <div className="skeleton-section welcome-skeleton">
          <div className="skeleton-title w-60"></div>
          <div className="skeleton-text w-40"></div>
          <div className="skeleton-button"></div>
        </div>

        {/* Cards Skeleton */}
        <div className="skeleton-section">
          <div className="skeleton-subtitle w-30"></div>
          <div className="skeleton-cards-grid">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="skeleton-card"></div>
            ))}
          </div>
        </div>

        {/* Stats Skeleton */}
        <div className="skeleton-section">
          <div className="skeleton-activity-card">
            <div className="skeleton-circle"></div>
            <div className="skeleton-content">
              <div className="skeleton-line w-40"></div>
              <div className="skeleton-line w-80"></div>
              <div className="skeleton-line w-60"></div>
            </div>
          </div>
        </div>

        {/* Courses Skeleton */}
        <div className="skeleton-section">
          <div className="skeleton-subtitle w-30"></div>
          <div className="skeleton-courses-grid">
            {[1, 2, 3].map((i) => (
              <div key={i} className="skeleton-course-card">
                <div className="skeleton-image"></div>
                <div className="skeleton-line w-80 mt-4"></div>
                <div className="skeleton-line w-60"></div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default DashboardSkeleton;
