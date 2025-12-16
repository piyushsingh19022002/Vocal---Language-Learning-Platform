import React, { useEffect, useState } from 'react';
import AdminTable from '../../components/admin/AdminTable';
import {
  getAdminCourses,
  createAdminCourse,
  updateAdminCourse,
  deleteAdminCourse,
} from '../../utils/api';
import './Admin.css';

const emptyCourse = {
  name: '',
  language: '',
  description: '',
  level: 'Beginner',
  type: 'mixed',
  status: 'active',
};

const AdminCourses = ({ showToast }) => {
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState(null);
  const [form, setForm] = useState(emptyCourse);
  const [confirm, setConfirm] = useState(null);

  const loadCourses = async () => {
    try {
      const data = await getAdminCourses();
      setCourses(data);
    } catch (err) {
      showToast?.(err.response?.data?.message || 'Failed to load courses', 'error');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadCourses();

  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const resetForm = () => {
    setEditing(null);
    setForm(emptyCourse);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editing) {
        const updated = await updateAdminCourse(editing._id, form);
        setCourses((prev) => prev.map((c) => (c._id === updated._id ? updated : c)));
        showToast?.('Course updated successfully', 'success');
      } else {
        const created = await createAdminCourse(form);
        setCourses((prev) => [created, ...prev]);
        showToast?.('Course created successfully', 'success');
      }
      resetForm();
    } catch (err) {
      showToast?.(err.response?.data?.message || 'Failed to save course', 'error');
    }
  };

  const handleEdit = (course) => {
    setEditing(course);
    setForm({
      name: course.name || '',
      language: course.language || '',
      description: course.description || '',
      level: course.level || 'Beginner',
      type: course.type || 'mixed',
      status: course.status || 'active',
    });
  };

  const requestDelete = (course) => {
    setConfirm({
      type: 'deleteCourse',
      course,
      message: `Are you sure you want to delete course "${course.name}"?`,
    });
  };

  const confirmDelete = async () => {
    if (!confirm || confirm.type !== 'deleteCourse') return;
    try {
      await deleteAdminCourse(confirm.course._id);
      setCourses((prev) => prev.filter((c) => c._id !== confirm.course._id));
      showToast?.('Course deleted successfully', 'success');
    } catch (err) {
      showToast?.(err.response?.data?.message || 'Failed to delete course', 'error');
    } finally {
      setConfirm(null);
    }
  };

  const columns = [
    { key: 'name', label: 'Title' },
    { key: 'language', label: 'Language' },
    {
      key: 'type',
      label: 'Type',
      render: (value) => value || 'mixed',
    },
    {
      key: 'level',
      label: 'Level',
    },
    {
      key: 'status',
      label: 'Status',
      render: (value) =>
        value === 'coming_soon'
          ? 'Coming Soon'
          : value === 'draft'
          ? 'Draft'
          : 'Active',
    },
  ];

  const actions = [
    {
      label: 'Edit',
      variant: 'secondary',
      onClick: (row) => handleEdit(row),
      icon: '✏️',
    },
    {
      label: 'Delete',
      variant: 'danger',
      onClick: (row) => requestDelete(row),
      icon: '🗑',
    },
  ];

  if (loading) {
    return <div className="admin-loading">Loading courses...</div>;
  }

  return (
    <div className="admin-content">
      <h1 className="admin-page-title">Courses</h1>

      <div className="admin-card admin-form-card">
        <h2 className="admin-form-title">
          {editing ? `Edit Course: ${editing.name}` : 'Add Course'}
        </h2>
        <form className="admin-form" onSubmit={handleSubmit}>
          <div className="admin-form-row">
            <div className="admin-form-group">
              <label>Title</label>
              <input
                type="text"
                name="name"
                value={form.name}
                onChange={handleChange}
                required
              />
            </div>
            <div className="admin-form-group">
              <label>Language</label>
              <input
                type="text"
                name="language"
                value={form.language}
                onChange={handleChange}
                required
              />
            </div>
          </div>

          <div className="admin-form-group">
            <label>Description</label>
            <textarea
              name="description"
              value={form.description}
              onChange={handleChange}
              rows={3}
              required
            />
          </div>

          <div className="admin-form-row">
            <div className="admin-form-group">
              <label>Level</label>
              <select name="level" value={form.level} onChange={handleChange}>
                <option value="Beginner">Beginner</option>
                <option value="Intermediate">Intermediate</option>
                <option value="Advanced">Advanced</option>
              </select>
            </div>
            <div className="admin-form-group">
              <label>Type</label>
              <select name="type" value={form.type} onChange={handleChange}>
                <option value="mixed">Mixed</option>
                <option value="listening">Listening</option>
                <option value="vocabulary">Vocabulary</option>
                <option value="reading">Reading</option>
                <option value="speaking">Speaking</option>
              </select>
            </div>
            <div className="admin-form-group">
              <label>Status</label>
              <select name="status" value={form.status} onChange={handleChange}>
                <option value="active">Active</option>
                <option value="coming_soon">Coming Soon</option>
                <option value="draft">Draft</option>
              </select>
            </div>
          </div>

          <div className="admin-form-actions">
            {editing && (
              <button
                type="button"
                className="admin-btn admin-btn-ghost"
                onClick={resetForm}
              >
                Cancel
              </button>
            )}
            <button type="submit" className="admin-btn admin-btn-primary">
              {editing ? 'Save Changes' : 'Add Course'}
            </button>
          </div>
        </form>
      </div>

      <AdminTable columns={columns} data={courses} actions={actions} />

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

export default AdminCourses;

