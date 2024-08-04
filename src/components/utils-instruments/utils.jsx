import React from 'react';
import './NotificationModal.css'; 


// Utility function to parse filesize string to number
const parseFileSize = (sizeStr) => {
    if (typeof sizeStr !== 'string') return 0;
    return parseInt(sizeStr.replace(/,/g, ''), 10) || 0;
  };
  
export {parseFileSize}



const NotificationModal = ({ show, message, onClose }) => {
  if (!show) {
    return null;
  }

  return (
    <div className="notification-modal-overlay">
      <div className="notification-modal">
        <div className="notification-modal-content">
          <p>{message}</p>
          <button onClick={onClose}>OK</button>
        </div>
      </div>
    </div>
  );
};

export default NotificationModal;

