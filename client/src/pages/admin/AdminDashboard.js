import React, { useEffect, useState } from 'react';
import AdminCard from '../../components/admin/AdminCard';
import { getAdminSummary } from '../../utils/api';
import './Admin.css';

const AdminDashboard = () => {
  const [summary, setSummary] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchSummary = async () => {
      try {
        const data = await getAdminSummary();
        setSummary(data);
      } catch (err) {
        setError(err.response?.data?.message || 'Failed to load summary');
      } finally {
        setLoading(false);
      }
    };

    fetchSummary();
  }, []);

  if (loading) {
    return <div className="admin-loading">Loading dashboard...</div>;
  }

  if (error) {
    return <div className="admin-error">{error}</div>;
  }

  return (
    <div className="admin-content">
      <h1 className="admin-page-title">Admin Dashboard</h1>
      <div className="admin-cards-grid">
        <AdminCard
          title="Total Users"
          value={summary.totalUsers}
          icon="👥"
        />
        <AdminCard
          title="Verified Users"
          value={summary.verifiedUsers}
          icon="✅"
          accent="green"
        />
        <AdminCard
          title="Total Courses"
          value={summary.totalCourses}
          icon="📚"
          accent="blue"
        />
        <AdminCard
          title="Listening Lessons"
          value={summary.listeningLessons}
          icon="🎧"
          accent="orange"
        />
        <AdminCard
          title="Contact Messages"
          value={summary.contactMessages}
          icon="✉️"
          accent="pink"
        />
      </div>
    </div>
  );
};

export default AdminDashboard;

