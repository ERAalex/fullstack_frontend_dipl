// AdminUserModal.js
import React from 'react';
import './AdminUserModal.css';

const AdminUserModal = ({ show, onClose, children }) => {
  if (!show) return null;

  return (
    <div className="modal-overlay">
      <div className="admin-modal-content">
        <button className="modal-close-button" onClick={onClose}>
          &times;
        </button>
        {children}
      </div>
    </div>
  );
};

export default AdminUserModal;