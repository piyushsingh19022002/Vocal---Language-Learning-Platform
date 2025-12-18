import React from 'react';
import './Admin.css';

const AdminCard = ({ title, value, icon, accent = 'purple' }) => {
  return (
    <div className={`admin-card admin-card-${accent}`}>
      <div className="admin-card-header">
        <span className="admin-card-icon">{icon}</span>
        <span className="admin-card-title">{title}</span>
      </div>
      <div className="admin-card-value">{value}</div>
    </div>
  );
};

export default AdminCard;

