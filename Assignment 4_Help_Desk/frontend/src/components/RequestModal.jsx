import React, { useState, useEffect } from "react";

const initialForm = {
  studentName: "",
  email: "",
  category: "",
  priority: "",
  description: ""
};

function RequestModal({ isOpen, onClose, onSubmit, editingRequest, isSubmitting }) {
  const [formData, setFormData] = useState(initialForm);
  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (editingRequest) {
      setFormData({
        studentName: editingRequest.studentName || "",
        email: editingRequest.email || "",
        category: editingRequest.category || "",
        priority: editingRequest.priority || "",
        description: editingRequest.description || ""
      });
      setErrors({});
    } else {
      setFormData(initialForm);
      setErrors({});
    }
  }, [editingRequest, isOpen]);

  if (!isOpen) return null;

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value
    }));

    if (errors[name]) {
      setErrors((prev) => ({
        ...prev,
        [name]: ""
      }));
    }
  };

  const validate = () => {
    const newErrors = {};

    if (!formData.studentName.trim()) {
      newErrors.studentName = "Please enter your name.";
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!formData.email.trim()) {
      newErrors.email = "Please enter your email.";
    } else if (!emailRegex.test(formData.email.trim())) {
      newErrors.email = "Please enter a valid email format.";
    }

    if (!formData.category) {
      newErrors.category = "Please select a category.";
    }

    if (!formData.priority) {
      newErrors.priority = "Please select a priority.";
    }

    if (!formData.description.trim()) {
      newErrors.description = "Please describe the problem.";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!validate()) return;

    onSubmit({
      studentName: formData.studentName.trim(),
      email: formData.email.trim(),
      category: formData.category,
      priority: formData.priority,
      description: formData.description.trim()
    });
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-container" onClick={(e) => e.stopPropagation()}>
        {/* Modal Header */}
        <div className="modal-header">
          <div>
            <span className="modal-kicker">CAMPUS SERVICE</span>
            <h2 className="modal-title">
              {editingRequest ? "Edit Request" : "Report a Problem"}
            </h2>
            <p className="modal-subtitle">
              {editingRequest
                ? "Update your ticket details below."
                : "Tell us what needs attention."}
            </p>
          </div>
          <button type="button" className="modal-close" onClick={onClose} aria-label="Close modal">
            &times;
          </button>
        </div>

        {/* Modal Form */}
        <form onSubmit={handleSubmit} noValidate className="modal-form">
          {/* Student Name */}
          <div className="form-group">
            <label htmlFor="studentName">Student Name</label>
            <input
              type="text"
              id="studentName"
              name="studentName"
              value={formData.studentName}
              onChange={handleChange}
              placeholder="Enter your name"
              disabled={isSubmitting}
            />
            {errors.studentName && <span className="input-error">{errors.studentName}</span>}
          </div>

          {/* Email */}
          <div className="form-group">
            <label htmlFor="email">Email</label>
            <input
              type="email"
              id="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="Enter your email"
              disabled={isSubmitting}
            />
            {errors.email && <span className="input-error">{errors.email}</span>}
          </div>

          {/* Row for Category & Priority */}
          <div className="form-row">
            <div className="form-group">
              <label htmlFor="category">Category</label>
              <select
                id="category"
                name="category"
                value={formData.category}
                onChange={handleChange}
                disabled={isSubmitting}
              >
                <option value="" disabled>Select category ▼</option>
                <option value="Academic">Academic</option>
                <option value="Hostel">Hostel</option>
                <option value="Transport">Transport</option>
                <option value="Library">Library</option>
                <option value="Infrastructure">Infrastructure</option>
                <option value="IT Support">IT Support</option>
                <option value="Other">Other</option>
              </select>
              {errors.category && <span className="input-error">{errors.category}</span>}
            </div>

            <div className="form-group">
              <label htmlFor="priority">Priority</label>
              <select
                id="priority"
                name="priority"
                value={formData.priority}
                onChange={handleChange}
                disabled={isSubmitting}
              >
                <option value="" disabled>Select priority ▼</option>
                <option value="Low">Low</option>
                <option value="Medium">Medium</option>
                <option value="High">High</option>
              </select>
              {errors.priority && <span className="input-error">{errors.priority}</span>}
            </div>
          </div>

          {/* Problem Description */}
          <div className="form-group">
            <label htmlFor="description">Problem Description</label>
            <textarea
              id="description"
              name="description"
              rows="4"
              value={formData.description}
              onChange={handleChange}
              placeholder="Describe the problem..."
              disabled={isSubmitting}
            />
            {errors.description && <span className="input-error">{errors.description}</span>}
          </div>

          {/* Modal Actions */}
          <div className="modal-actions">
            <button
              type="button"
              className="btn btn-secondary"
              onClick={onClose}
              disabled={isSubmitting}
            >
              Cancel
            </button>
            <button
              type="submit"
              className="btn btn-gold"
              disabled={isSubmitting}
            >
              {isSubmitting
                ? editingRequest ? "Saving..." : "Submitting..."
                : editingRequest ? "Save Changes" : "Submit Request"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default RequestModal;
