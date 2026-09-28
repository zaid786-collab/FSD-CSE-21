import React from "react";

function DeleteModal({ isOpen, onClose, onConfirm, targetRequest, isDeleting }) {
  if (!isOpen || !targetRequest) return null;

  const visualId = `#REQ-${targetRequest._id.slice(-4).toUpperCase()}`;

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-container delete-modal-container" onClick={(e) => e.stopPropagation()}>
        <div className="delete-modal-content">
          <div className="delete-icon">◇</div>
          <h2 className="delete-title">Delete Request?</h2>
          <p className="delete-subtitle">
            Are you sure you want to delete ticket <strong>{visualId}</strong>?
            <br />
            This action cannot be undone.
          </p>

          <div className="delete-actions">
            <button
              type="button"
              className="btn btn-secondary"
              onClick={onClose}
              disabled={isDeleting}
            >
              Cancel
            </button>
            <button
              type="button"
              className="btn btn-danger"
              onClick={onConfirm}
              disabled={isDeleting}
            >
              {isDeleting ? "Deleting..." : "Delete"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default DeleteModal;
