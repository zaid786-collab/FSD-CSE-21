import React from "react";

function DetailsModal({ isOpen, onClose, request, onEdit }) {
  if (!isOpen || !request) return null;

  const visualId = `#REQ-${request._id.slice(-4).toUpperCase()}`;
  const submittedDate = request.createdAt
    ? new Date(request.createdAt).toLocaleDateString("en-US", {
        day: "numeric",
        month: "long",
        year: "numeric"
      })
    : "Recently";

  const priorityLower = (request.priority || "low").toLowerCase();

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-container details-modal-container" onClick={(e) => e.stopPropagation()}>
        {/* Header */}
        <div className="modal-header">
          <div>
            <span className="modal-kicker">REQUEST DETAILS</span>
            <h2 className="modal-title">{visualId}</h2>
            <p className="details-title-preview">
              {request.description.length > 60
                ? `${request.description.slice(0, 58)}...`
                : request.description}
            </p>
          </div>
          <button type="button" className="modal-close" onClick={onClose} aria-label="Close modal">
            &times;
          </button>
        </div>

        <div className="modal-divider"></div>

        {/* Content Grid */}
        <div className="details-grid">
          <div className="details-field">
            <span className="details-label">Student</span>
            <span className="details-value">{request.studentName}</span>
          </div>

          <div className="details-field">
            <span className="details-label">Email</span>
            <span className="details-value">{request.email}</span>
          </div>

          <div className="details-field">
            <span className="details-label">Category</span>
            <span className="details-value">{request.category}</span>
          </div>

          <div className="details-field">
            <span className="details-label">Priority</span>
            <span className={`details-priority-tag priority-${priorityLower}`}>
              ● {request.priority?.toUpperCase()}
            </span>
          </div>

          <div className="details-field full-row">
            <span className="details-label">Description</span>
            <p className="details-description-text">{request.description}</p>
          </div>

          <div className="details-field full-row">
            <span className="details-label">Submitted</span>
            <span className="details-value">{submittedDate}</span>
          </div>
        </div>

        <div className="modal-divider"></div>

        {/* Footer Actions */}
        <div className="modal-actions space-between">
          <button
            type="button"
            className="btn btn-secondary"
            onClick={onClose}
          >
            Close
          </button>

          <button
            type="button"
            className="btn btn-gold"
            onClick={() => {
              onClose();
              onEdit(request);
            }}
          >
            Edit Request
          </button>
        </div>
      </div>
    </div>
  );
}

export default DetailsModal;
