import React, { useEffect, useState } from 'react';
import { Routes, Route, NavLink, useNavigate } from 'react-router-dom';
import { getCurrentUser } from '../../utils/api';
import AdminDashboard from './AdminDashboard';
import AdminUsers from './AdminUsers';
import AdminCourses from './AdminCourses';
import AdminLessons from './AdminLessons';
import AdminContacts from './AdminContacts';
import '../admin/Admin.css';

const AdminPage = () => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [toast, setToast] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const init = async () => {
      const token = localStorage.getItem('token');
      if (!token) {
        navigate('/');
        return;
      }
      try {
        const me = await getCurrentUser();
        if (!me || me.role !== 'admin') {
          navigate('/');
          return;
        }
        setUser(me);
      } catch (err) {
        navigate('/');
      } finally {
        setLoading(false);
      }
    };

    init();
  }, [navigate]);

  const handleLogout = () => {
    localStorage.removeItem('token');
    navigate('/login');
  };

  const showToast = (message, type = 'info') => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 3000);
  };

  if (loading) {
    return <div className="admin-fullscreen-loading">Checking admin access...</div>;
  }

  if (!user) {
    return null;
  }

  return (
    <div className="admin-layout">
      <aside className="admin-sidebar">
        <div className="admin-sidebar-header">
          <div className="admin-logo-circle">A</div>
          <div>
            <div className="admin-logo-text">Vocal Admin</div>
            <div className="admin-logo-subtext">Control Panel</div>
          </div>
        </div>
        <nav className="admin-nav">
          <NavLink end to="/admin" className="admin-nav-link">
            <span className="admin-nav-icon">📊</span>
            <span>Dashboard</span>
          </NavLink>
          <NavLink to="/admin/users" className="admin-nav-link">
            <span className="admin-nav-icon">👥</span>
            <span>Users</span>
          </NavLink>
          <NavLink to="/admin/courses" className="admin-nav-link">
            <span className="admin-nav-icon">📚</span>
            <span>Courses</span>
          </NavLink>
          <NavLink to="/admin/lessons" className="admin-nav-link">
            <span className="admin-nav-icon">🎧</span>
            <span>Lessons</span>
          </NavLink>
          <NavLink to="/admin/contact-messages" className="admin-nav-link">
            <span className="admin-nav-icon">✉️</span>
            <span>Contact Messages</span>
          </NavLink>
        </nav>
      </aside>

      <div className="admin-main">
        <header className="admin-header">
          <div className="admin-header-left">
            <h1 className="admin-header-title">Admin Panel</h1>
            <p className="admin-header-subtitle">
              Manage users, courses, lessons and messages.
            </p>
          </div>
          <div className="admin-header-right">
            <div className="admin-admin-info">
              <div className="admin-admin-name">{user.name || user.email}</div>
              <div className="admin-admin-role">Administrator</div>
            </div>
            <button className="admin-btn admin-btn-ghost" onClick={handleLogout}>
              Logout
            </button>
          </div>
        </header>

        <main className="admin-main-content">
          <Routes>
            <Route path="/" element={<AdminDashboard />} />
            <Route path="/users" element={<AdminUsers showToast={showToast} />} />
            <Route path="/courses" element={<AdminCourses showToast={showToast} />} />
            <Route path="/lessons" element={<AdminLessons showToast={showToast} />} />
            <Route
              path="/contact-messages"
              element={<AdminContacts showToast={showToast} />}
            />
          </Routes>
        </main>
      </div>

      {toast && (
        <div className={`admin-toast admin-toast-${toast.type}`}>
          {toast.message}
        </div>
      )}
    </div>
  );
};

export default AdminPage;

