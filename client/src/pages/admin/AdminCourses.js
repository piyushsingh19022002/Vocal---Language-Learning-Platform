import React, { useEffect, useState } from 'react';
import AdminTable from '../../components/admin/AdminTable';
import {
  getAdminCourses,
  createAdminCourse,
  updateAdminCourse,
  deleteAdminCourse,
  getLessonsByCourse,
  createLesson,
  updateLesson,
  deleteLesson,
} from '../../utils/api';
import './Admin.css';

const emptyCourse = {
  name: '',
  language: '',
  description: '',
  level: 'Beginner',
  type: 'mixed',
  status: 'active',
  image: '📚',
};

const emptyLesson = {
  title: '',
  type: 'Listening',
  description: '',
  content: '',
  order: 1,
};

const AdminCourses = ({ showToast }) => {
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState(null);
  const [form, setForm] = useState(emptyCourse);
  const [confirm, setConfirm] = useState(null);

  // Lesson management state
  const [selectedCourse, setSelectedCourse] = useState(null);
  const [lessons, setLessons] = useState([]);
  const [editingLesson, setEditingLesson] = useState(null);
  const [lessonForm, setLessonForm] = useState(emptyLesson);
  const [showLessonForm, setShowLessonForm] = useState(false);

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
      image: course.image || '📚',
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

  // Lesson management functions
  const loadLessons = async (courseId) => {
    try {
      const data = await getLessonsByCourse(courseId);
      setLessons(data);
    } catch (err) {
      showToast?.(err.response?.data?.message || 'Failed to load lessons', 'error');
    }
  };

  const handleManageLessons = (course) => {
    setSelectedCourse(course);
    loadLessons(course._id);
    setShowLessonForm(false);
  };

  const handleLessonChange = (e) => {
    const { name, value } = e.target;
    setLessonForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleLessonSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingLesson) {
        const updated = await updateLesson(editingLesson._id, lessonForm);
        setLessons((prev) => prev.map((l) => (l._id === updated._id ? updated : l)));
        showToast?.('Lesson updated successfully', 'success');
      } else {
        const created = await createLesson({ ...lessonForm, course: selectedCourse._id });
        setLessons((prev) => [...prev, created]);
        showToast?.('Lesson created successfully', 'success');
      }
      setLessonForm(emptyLesson);
      setEditingLesson(null);
      setShowLessonForm(false);
    } catch (err) {
      showToast?.(err.response?.data?.message || 'Failed to save lesson', 'error');
    }
  };

  const handleEditLesson = (lesson) => {
    setEditingLesson(lesson);
    setLessonForm({
      title: lesson.title || '',
      type: lesson.type || 'Listening',
      description: lesson.description || '',
      content: lesson.content || '',
      order: lesson.order || 1,
    });
    setShowLessonForm(true);
  };

  const handleDeleteLesson = async (lesson) => {
    if (!window.confirm(`Are you sure you want to delete lesson "${lesson.title}"?`)) return;
    try {
      await deleteLesson(lesson._id);
      setLessons((prev) => prev.filter((l) => l._id !== lesson._id));
      showToast?.('Lesson deleted successfully', 'success');
    } catch (err) {
      showToast?.(err.response?.data?.message || 'Failed to delete lesson', 'error');
    }
  };

  const closeLessonManager = () => {
    setSelectedCourse(null);
    setLessons([]);
    setShowLessonForm(false);
    setEditingLesson(null);
    setLessonForm(emptyLesson);
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
      label: 'Manage Lessons',
      variant: 'primary',
      onClick: (row) => handleManageLessons(row),
      icon: '📚',
    },
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
            <label>Image/Emoji</label>
            <input
              type="text"
              name="image"
              value={form.image}
              onChange={handleChange}
              placeholder="Enter emoji or image URL (e.g., 📚, 🇬🇧)"
            />
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

      {/* Lesson Management Modal */}
      {selectedCourse && (
        <div className="admin-modal-backdrop">
          <div className="admin-modal" style={{ maxWidth: '900px', maxHeight: '90vh', overflow: 'auto' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
              <h2 className="admin-modal-title">
                Manage Lessons: {selectedCourse.name}
              </h2>
              <button
                className="admin-btn admin-btn-ghost"
                onClick={closeLessonManager}
                style={{ padding: '0.5rem 1rem' }}
              >
                ✕ Close
              </button>
            </div>

            {!showLessonForm && (
              <button
                className="admin-btn admin-btn-primary"
                onClick={() => setShowLessonForm(true)}
                style={{ marginBottom: '1rem' }}
              >
                + Add Lesson
              </button>
            )}

            {showLessonForm && (
              <div className="admin-card" style={{ marginBottom: '1.5rem' }}>
                <h3 style={{ marginBottom: '1rem' }}>
                  {editingLesson ? 'Edit Lesson' : 'Add New Lesson'}
                </h3>
                <form onSubmit={handleLessonSubmit}>
                  <div className="admin-form-row">
                    <div className="admin-form-group">
                      <label>Title *</label>
                      <input
                        type="text"
                        name="title"
                        value={lessonForm.title}
                        onChange={handleLessonChange}
                        required
                      />
                    </div>
                    <div className="admin-form-group">
                      <label>Type *</label>
                      <select
                        name="type"
                        value={lessonForm.type}
                        onChange={handleLessonChange}
                        required
                      >
                        <option value="Listening">Listening</option>
                        <option value="Speaking">Speaking</option>
                        <option value="Reading">Reading</option>
                        <option value="Writing">Writing</option>
                        <option value="Vocabulary">Vocabulary</option>
                      </select>
                    </div>
                    <div className="admin-form-group">
                      <label>Order</label>
                      <input
                        type="number"
                        name="order"
                        value={lessonForm.order}
                        onChange={handleLessonChange}
                        min="1"
                      />
                    </div>
                  </div>

                  <div className="admin-form-group">
                    <label>Description</label>
                    <textarea
                      name="description"
                      value={lessonForm.description}
                      onChange={handleLessonChange}
                      rows={2}
                    />
                  </div>

                  <div className="admin-form-group">
                    <label>Content</label>
                    <textarea
                      name="content"
                      value={lessonForm.content}
                      onChange={handleLessonChange}
                      rows={4}
                      placeholder="Enter lesson content here..."
                    />
                  </div>

                  <div className="admin-form-actions">
                    <button
                      type="button"
                      className="admin-btn admin-btn-ghost"
                      onClick={() => {
                        setShowLessonForm(false);
                        setEditingLesson(null);
                        setLessonForm(emptyLesson);
                      }}
                    >
                      Cancel
                    </button>
                    <button type="submit" className="admin-btn admin-btn-primary">
                      {editingLesson ? 'Update Lesson' : 'Add Lesson'}
                    </button>
                  </div>
                </form>
              </div>
            )}

            <div className="admin-card">
              <h3 style={{ marginBottom: '1rem' }}>
                Lessons ({lessons.length})
              </h3>
              {lessons.length === 0 ? (
                <p style={{ color: '#718096', textAlign: 'center', padding: '2rem' }}>
                  No lessons yet. Click "Add Lesson" to create one.
                </p>
              ) : (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                  {lessons.sort((a, b) => a.order - b.order).map((lesson) => (
                    <div
                      key={lesson._id}
                      style={{
                        padding: '1rem',
                        border: '1px solid #e2e8f0',
                        borderRadius: '8px',
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'center',
                      }}
                    >
                      <div style={{ flex: 1 }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.25rem' }}>
                          <span style={{ fontWeight: '600', color: '#667eea' }}>
                            #{lesson.order}
                          </span>
                          <h4 style={{ margin: 0, fontSize: '1rem' }}>{lesson.title}</h4>
                          <span
                            style={{
                              fontSize: '0.75rem',
                              padding: '0.25rem 0.5rem',
                              borderRadius: '4px',
                              background: '#edf2f7',
                              color: '#4a5568',
                            }}
                          >
                            {lesson.type}
                          </span>
                        </div>
                        {lesson.description && (
                          <p style={{ margin: '0.25rem 0 0 0', fontSize: '0.875rem', color: '#718096' }}>
                            {lesson.description}
                          </p>
                        )}
                      </div>
                      <div style={{ display: 'flex', gap: '0.5rem' }}>
                        <button
                          className="admin-btn admin-btn-secondary"
                          onClick={() => handleEditLesson(lesson)}
                          style={{ padding: '0.5rem 0.75rem', fontSize: '0.875rem' }}
                        >
                          ✏️ Edit
                        </button>
                        <button
                          className="admin-btn admin-btn-danger"
                          onClick={() => handleDeleteLesson(lesson)}
                          style={{ padding: '0.5rem 0.75rem', fontSize: '0.875rem' }}
                        >
                          🗑 Delete
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      )}

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

