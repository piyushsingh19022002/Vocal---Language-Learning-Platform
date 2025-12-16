import React, { useEffect, useState } from 'react';
import AdminTable from '../../components/admin/AdminTable';
import { getAdminListeningLessons, deleteAdminListeningLesson } from '../../utils/api';
import './Admin.css';

const AdminLessons = ({ showToast }) => {
  const [lessons, setLessons] = useState([]);
  const [loading, setLoading] = useState(true);
  const [confirm, setConfirm] = useState(null);

  const loadLessons = async () => {
    try {
      const data = await getAdminListeningLessons();
      setLessons(data);
    } catch (err) {
      showToast?.(err.response?.data?.message || 'Failed to load lessons', 'error');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadLessons();
  }, []);

  const requestDelete = (lesson) => {
    setConfirm({
      type: 'deleteLesson',
      lesson,
      message: `Are you sure you want to delete lesson "${lesson.title}"?`,
    });
  };

  const confirmDelete = async () => {
    if (!confirm || confirm.type !== 'deleteLesson') return;
    try {
      await deleteAdminListeningLesson(confirm.lesson._id);
      setLessons((prev) => prev.filter((l) => l._id !== confirm.lesson._id));
      showToast?.('Lesson deleted successfully', 'success');
    } catch (err) {
      showToast?.(err.response?.data?.message || 'Failed to delete lesson', 'error');
    } finally {
      setConfirm(null);
    }
  };

  const columns = [
    { key: 'title', label: 'Title' },
    { key: 'language', label: 'Language' },
    { key: 'audio', label: 'Audio URL' },
    {
      key: 'duration',
      label: 'Duration',
      render: (value) => (value ? `${value} min` : '-'),
    },
  ];

  const actions = [
    {
      label: 'Delete',
      variant: 'danger',
      onClick: (row) => requestDelete(row),
      icon: '🗑',
    },
  ];

  if (loading) {
    return <div className="admin-loading">Loading lessons...</div>;
  }

  return (
    <div className="admin-content">
      <h1 className="admin-page-title">Listening Lessons</h1>
      <p className="admin-page-subtitle">
        Use the existing lesson creation tools to add new listening lessons. You can manage and
        delete them here.
      </p>
      <AdminTable columns={columns} data={lessons} actions={actions} />

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
    </div>
  );
};

export default AdminLessons;

