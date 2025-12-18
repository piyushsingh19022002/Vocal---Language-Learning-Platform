import React, { useEffect, useState } from 'react';
import AdminTable from '../../components/admin/AdminTable';
import { getAdminUsers, setUserBlocked, deleteUser } from '../../utils/api';
import './Admin.css';

const AdminUsers = ({ showToast }) => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [confirm, setConfirm] = useState(null);

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

  useEffect(() => {
    loadUsers();

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

  const actions = [
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

  const normalizedActions = actions.map((action) => ({
    ...action,
    label: typeof action.label === 'function' ? undefined : action.label,
  }));

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
    </div>
  );
};

export default AdminUsers;

