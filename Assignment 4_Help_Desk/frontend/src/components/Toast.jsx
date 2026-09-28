import React from "react";

function Toast({ toast, onClose }) {
  if (!toast) return null;

  const isSuccess = toast.type === "success";

  return (
    <div className={`toast-banner ${isSuccess ? "toast-success" : "toast-error"}`} role="alert">
      <div className="toast-body">
        <span className="toast-icon">{isSuccess ? "✓" : "!"}</span>
        <span className="toast-message">{toast.message}</span>
      </div>
      <button type="button" className="toast-close" onClick={onClose} aria-label="Close notification">
        &times;
      </button>
    </div>
  );
}

export default Toast;
