import React from 'react';
import './modalConfirmation.css';

const ConfirmationModal = ({ show, onClose, onConfirm, message }) => {
  if (!show) {
    return null;
  }

  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <p>{message}</p>
        <button className="confirm-button" onClick={onConfirm}>
          Yes
        </button>
        <button className="cancel-button" onClick={onClose}>
          No
        </button>
      </div>
    </div>
  );
};

export default ConfirmationModal;
