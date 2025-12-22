import React, { useEffect, useState } from 'react';
import AdminTable from '../../components/admin/AdminTable';
import {
  getAdminUsers,
  setUserBlocked,
  deleteUser,
  getAdminCourses,
  assignCourseToUser,
  revokeCourseFromUser,
  getUserCourses
} from '../../utils/api';
import './Admin.css';

const AdminUsers = ({ showToast }) => {
  const [users, setUsers] = useState([]);
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [confirm, setConfirm] = useState(null);
  const [courseManager, setCourseManager] = useState(null); // { userId, enrolledCourses }

  const loadUsers = async () => {
    try {
      const data = await getAdminUsers();
      setUsers(data);
    } catch (err) {
      showToast?.(err.response?.data?.message || 'Failed to load users', 'error');
    } finally {
      setLoading(false);
    }
  };

  const loadCourses = async () => {
    try {
      const data = await getAdminCourses();
      setCourses(data);
    } catch (err) {
      console.error('Failed to load courses:', err);
    }
  };

  useEffect(() => {
    loadUsers();
    loadCourses();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleBlockToggle = async (user) => {
    try {
      const updated = await setUserBlocked(user._id, !user.isBlocked);
      setUsers((prev) => prev.map((u) => (u._id === updated._id ? updated : u)));
      showToast?.(
        updated.isBlocked ? 'User has been blocked' : 'User has been unblocked',
        'success'
      );
    } catch (err) {
      showToast?.(err.response?.data?.message || 'Failed to update user', 'error');
    }
  };

  const requestDelete = (user) => {
    setConfirm({
      type: 'deleteUser',
      user,
      message: `Are you sure you want to delete "${user.name || user.email}"? This action cannot be undone.`,
    });
  };

  const confirmDelete = async () => {
    if (!confirm || confirm.type !== 'deleteUser') return;
    try {
      await deleteUser(confirm.user._id);
      setUsers((prev) => prev.filter((u) => u._id !== confirm.user._id));
      showToast?.('User deleted successfully', 'success');
    } catch (err) {
      showToast?.(err.response?.data?.message || 'Failed to delete user', 'error');
    } finally {
      setConfirm(null);
    }
  };

  const columns = [
    {
      key: 'name',
      label: 'Name',
      render: (value, row) => value || row.email,
    },
    { key: 'email', label: 'Email' },
    {
      key: 'role',
      label: 'Role',
      render: (value) => (value === 'admin' ? 'Admin' : 'User'),
    },
    {
      key: 'isVerified',
      label: 'Verified',
      render: (value) => (value ? 'Yes' : 'No'),
    },
    {
      key: 'createdAt',
      label: 'Created',
      render: (value) => new Date(value).toLocaleDateString(),
    },
  ];

  const openCourseManager = async (user) => {
    try {
      const userId = user._id;
      // DEBUG LOG
      console.log('Fetching courses for user:', userId);
      console.log('API call will be: GET /api/admin/users/' + userId + '/courses');

      const userCoursesData = await getUserCourses(userId);

      console.log('Courses data received:', userCoursesData);

      setCourseManager({
        userId: userId,
        userName: user.name || user.email,
        enrolledCourses: userCoursesData.enrolledCourses || [],
      });
    } catch (err) {
      console.error('Error loading user courses:', err);
      console.error('Error response:', err.response);
      console.error('Error status:', err.response?.status);
      console.error('Error data:', err.response?.data);

      const errorMessage = err.response?.data?.message ||
        (err.response?.status === 404 ? 'Route not found. Please check server configuration.' :
          err.response?.status === 403 ? 'Admin access required' :
            err.response?.status === 500 ? 'Server error. Please try again later.' :
              'Failed to load user courses');
      showToast?.(errorMessage, 'error');
    }
  };

  const handleAssignCourse = async (courseId) => {
    if (!courseManager) return;
    try {
      await assignCourseToUser(courseManager.userId, courseId);
      const userCoursesData = await getUserCourses(courseManager.userId);
      setCourseManager({
        ...courseManager,
        enrolledCourses: userCoursesData.enrolledCourses || [],
      });
      showToast?.('Course assigned successfully', 'success');
      // Refresh users list
      loadUsers();
    } catch (err) {
      showToast?.(err.response?.data?.message || 'Failed to assign course', 'error');
    }
  };

  const handleRevokeCourse = async (courseId) => {
    if (!courseManager) return;
    try {
      await revokeCourseFromUser(courseManager.userId, courseId);
      const userCoursesData = await getUserCourses(courseManager.userId);
      setCourseManager({
        ...courseManager,
        enrolledCourses: userCoursesData.enrolledCourses || [],
      });
      showToast?.('Course access revoked successfully', 'success');
      // Refresh users list
      loadUsers();
    } catch (err) {
      showToast?.(err.response?.data?.message || 'Failed to revoke course', 'error');
    }
  };

  const actions = [
    {
      label: 'Manage Courses',
      variant: 'primary',
      onClick: (row) => openCourseManager(row),
      icon: '📚',
      disabled: (row) => row.role === 'admin',
    },
    {
      label: (row) => (row.isBlocked ? 'Unblock' : 'Block'),
      variant: 'secondary',
      onClick: (row) => handleBlockToggle(row),
      icon: '🚫',
      disabled: (row) => row.role === 'admin',
    },
    {
      label: 'Delete',
      variant: 'danger',
      onClick: (row) => requestDelete(row),
      icon: '🗑',
      disabled: (row) => row.role === 'admin',
    },
  ];

  if (loading) {
    return <div className="admin-loading">Loading users...</div>;
  }

  return (
    <div className="admin-content">
      <h1 className="admin-page-title">Users</h1>
      <AdminTable
        columns={columns}
        data={users}
        actions={actions.map((action) => ({
          ...action,
          label: undefined, // we'll render dynamic label in render
          onClick: action.onClick,
          disabled: action.disabled,
          icon: action.icon,
        }))}
      />

      {confirm && (
        <div className="admin-modal-backdrop">
          <div className="admin-modal">
            <h2 className="admin-modal-title">Confirm Delete</h2>
            <p className="admin-modal-message">{confirm.message}</p>
            <div className="admin-modal-actions">
              <button
                className="admin-btn admin-btn-ghost"
                onClick={() => setConfirm(null)}
              >
                Cancel
              </button>
              <button
                className="admin-btn admin-btn-danger"
                onClick={confirmDelete}
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Course Management Modal */}
      {courseManager && (
        <div className="admin-modal-backdrop">
          <div className="admin-modal" style={{ maxWidth: '600px', maxHeight: '80vh', overflowY: 'auto' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
              <h2 className="admin-modal-title">Manage Courses: {courseManager.userName}</h2>
              <button
                className="admin-btn admin-btn-ghost"
                onClick={() => setCourseManager(null)}
                style={{ padding: '0.5rem', minWidth: 'auto' }}
              >
                ✕
              </button>
            </div>

            <div style={{ marginBottom: '1.5rem' }}>
              <h3 style={{ fontSize: '1rem', fontWeight: 600, marginBottom: '1rem', color: '#4a5568' }}>
                Available Courses
              </h3>
              {courses.length === 0 ? (
                <p style={{ color: '#718096' }}>No courses available</p>
              ) : (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                  {courses.map((course) => {
                    const isEnrolled = courseManager.enrolledCourses.some(
                      (ec) => ec._id === course._id || ec.toString() === course._id
                    );
                    return (
                      <div
                        key={course._id}
                        style={{
                          display: 'flex',
                          justifyContent: 'space-between',
                          alignItems: 'center',
                          padding: '1rem',
                          background: isEnrolled ? '#f0fdf4' : '#f7fafc',
                          border: `2px solid ${isEnrolled ? '#10b981' : '#e2e8f0'}`,
                          borderRadius: '8px',
                        }}
                      >
                        <div>
                          <div style={{ fontWeight: 600, color: '#1a202c', marginBottom: '0.25rem' }}>
                            {course.name}
                          </div>
                          <div style={{ fontSize: '0.875rem', color: '#718096' }}>
                            {course.language} • {course.level}
                          </div>
                        </div>
                        <button
                          className={`admin-btn ${isEnrolled ? 'admin-btn-danger' : 'admin-btn-primary'}`}
                          onClick={() =>
                            isEnrolled
                              ? handleRevokeCourse(course._id)
                              : handleAssignCourse(course._id)
                          }
                          style={{ minWidth: '120px' }}
                        >
                          {isEnrolled ? '🔒 Revoke' : '✅ Assign'}
                        </button>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>

            <div className="admin-modal-actions">
              <button
                className="admin-btn admin-btn-ghost"
                onClick={() => setCourseManager(null)}
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminUsers;

