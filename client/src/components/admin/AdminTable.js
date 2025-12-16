import React from 'react';
import './Admin.css';

const AdminTable = ({ columns, data, actions }) => {
  return (
    <div className="admin-table-wrapper">
      <table className="admin-table">
        <thead>
          <tr>
            {columns.map((col) => (
              <th key={col.key}>{col.label}</th>
            ))}
            {actions && actions.length > 0 && <th>Actions</th>}
          </tr>
        </thead>
        <tbody>
          {data.length === 0 ? (
            <tr>
              <td colSpan={columns.length + (actions?.length ? 1 : 0)} className="admin-table-empty">
                No records found.
              </td>
            </tr>
          ) : (
            data.map((row) => (
              <tr key={row._id || row.id}>
                {columns.map((col) => (
                  <td key={col.key}>
                    {typeof col.render === 'function' ? col.render(row[col.key], row) : row[col.key]}
                  </td>
                ))}
                {actions && actions.length > 0 && (
                  <td className="admin-table-actions">
                    {actions.map((action) => (
                      <button
                        key={action.label}
                        className={`admin-btn admin-btn-${action.variant || 'ghost'}`}
                        onClick={() => action.onClick(row)}
                        disabled={action.disabled?.(row)}
                      >
                        {action.icon && <span className="admin-btn-icon">{action.icon}</span>}
                        {action.label}
                      </button>
                    ))}
                  </td>
                )}
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
};

export default AdminTable;

