import React from "react";

// Generate unique-looking ID like #REQ-A82F from MongoDB ObjectId
function getVisualId(objectId) {
  if (!objectId) return "#REQ-0000";
  return `#REQ-${objectId.toString().slice(-4).toUpperCase()}`;
}

function RequestCard({ request, onEdit, onDelete, onViewDetails }) {
  const priorityClass = (request.priority || "low").toLowerCase();

  return (
    <article
      className={`req-card priority-${priorityClass}`}
      onClick={() => onViewDetails(request)}
    >
      {/* Top Header Row */}
      <div className="req-card-top">
        <div className={`priority-tag priority-${priorityClass}`}>
          <span className="priority-dot">●</span>
          <span className="priority-label">{request.priority?.toUpperCase()} PRIORITY</span>
        </div>
        <span className="req-id">{getVisualId(request._id)}</span>
      </div>

      {/* Main Subject / Description Summary */}
      <h3 className="req-card-title">
        {request.description.length > 70
          ? `${request.description.slice(0, 68)}...`
          : request.description}
      </h3>

      {/* Category */}
      <div className="req-category-tag">
        <span>{request.category}</span>
      </div>

      {/* Description Snippet */}
      <p className="req-card-body">
        {request.description}
      </p>

      {/* Student Meta */}
      <div className="req-student-info">
        <span className="student-name">{request.studentName}</span>
        <span className="student-sep">•</span>
        <span className="student-email">{request.email}</span>
      </div>

      {/* Divider */}
      <div className="req-card-divider"></div>

      {/* Action Footer */}
      <div className="req-card-footer" onClick={(e) => e.stopPropagation()}>
        <span className="view-details-hint" onClick={() => onViewDetails(request)}>
          Click to view details &rarr;
        </span>

        <div className="req-card-actions">
          <button
            type="button"
            className="action-btn edit-btn"
            onClick={() => onEdit(request)}
          >
            Edit
          </button>
          <button
            type="button"
            className="action-btn delete-btn"
            onClick={() => onDelete(request)}
          >
            Delete
          </button>
        </div>
      </div>
    </article>
  );
}

export default RequestCard;
