import React, { useEffect, useState } from 'react';
import AdminTable from '../../components/admin/AdminTable';
import {
  getAdminContactMessages,
  getAdminContactMessage,
  markContactMessageRead,
} from '../../utils/api';
import './Admin.css';

const AdminContacts = ({ showToast }) => {
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selected, setSelected] = useState(null);

  const loadMessages = async () => {
    try {
      const data = await getAdminContactMessages();
      setMessages(data);
    } catch (err) {
      showToast?.(err.response?.data?.message || 'Failed to load messages', 'error');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadMessages();
  }, []);

  const openMessage = async (msg) => {
    try {
      const full = await getAdminContactMessage(msg._id);
      setSelected(full);
      if (!msg.isRead) {
        const updated = await markContactMessageRead(msg._id);
        setMessages((prev) =>
          prev.map((m) => (m._id === updated._id ? updated : m))
        );
      }
    } catch (err) {
      showToast?.(err.response?.data?.message || 'Failed to open message', 'error');
    }
  };

  const columns = [
    { key: 'name', label: 'Name' },
    { key: 'email', label: 'Email' },
    { key: 'subject', label: 'Subject' },
    {
      key: 'createdAt',
      label: 'Date',
      render: (value) => new Date(value).toLocaleString(),
    },
    {
      key: 'isRead',
      label: 'Status',
      render: (value) => (value ? 'Read' : 'Unread'),
    },
  ];

  const actions = [
    {
      label: 'View',
      variant: 'secondary',
      onClick: (row) => openMessage(row),
      icon: '👁',
    },
  ];

  if (loading) {
    return <div className="admin-loading">Loading contact messages...</div>;
  }

  return (
    <div className="admin-content">
      <h1 className="admin-page-title">Contact Messages</h1>
      <AdminTable columns={columns} data={messages} actions={actions} />

      {selected && (
        <div className="admin-modal-backdrop">
          <div className="admin-modal admin-modal-large">
            <h2 className="admin-modal-title">{selected.subject}</h2>
            <div className="admin-modal-meta">
              <p>
                <strong>From:</strong> {selected.name} ({selected.email})
              </p>
              <p>
                <strong>Category:</strong> {selected.category || 'Not specified'}
              </p>
              <p>
                <strong>Date:</strong>{' '}
                {new Date(selected.createdAt).toLocaleString()}
              </p>
            </div>
            <div className="admin-modal-message-box">
              <p>{selected.message}</p>
            </div>
            <div className="admin-modal-actions">
              <button
                className="admin-btn admin-btn-primary"
                onClick={() => setSelected(null)}
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

export default AdminContacts;

