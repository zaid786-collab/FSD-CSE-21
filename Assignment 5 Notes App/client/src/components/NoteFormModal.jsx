import React, { useState, useEffect } from 'react';
import { X, Save, PenSquare, PlusCircle } from 'lucide-react';

export default function NoteFormModal({
  isOpen,
  initialNote,
  onClose,
  onSave
}) {
  const [title, setTitle] = useState('');
  const [category, setCategory] = useState('');
  const [tags, setTags] = useState('');
  const [content, setContent] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (initialNote) {
      setTitle(initialNote.title || '');
      setCategory(initialNote.category || '');
      setTags((initialNote.tags || []).join(', '));
      setContent(initialNote.content || '');
    } else {
      setTitle('');
      setCategory('Web Development');
      setTags('');
      setContent('');
    }
  }, [initialNote, isOpen]);

  if (!isOpen) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!title.trim() || !content.trim()) return;

    setIsSubmitting(true);
    await onSave({
      id: initialNote ? initialNote.id : undefined,
      title: title.trim(),
      category: category.trim() || 'General',
      tags: tags.split(',').map(t => t.trim().toLowerCase().replace(/^#/, '')).filter(Boolean),
      content: content.trim()
    });
    setIsSubmitting(false);
  };

  return (
    <div className="modal-overlay" onClick={onClose} role="dialog" aria-modal="true">
      <div className="modal-container form-modal-container" onClick={(e) => e.stopPropagation()}>
        {/* Header */}
        <div className="modal-header">
          <h2 className="modal-title">
            {initialNote ? (
              <><PenSquare size={20} /> Edit Note</>
            ) : (
              <><PlusCircle size={20} /> Create New Note</>
            )}
          </h2>
          <button className="btn-icon" onClick={onClose} title="Close">
            <X size={18} />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="modal-form">
          <div className="form-group">
            <label htmlFor="noteTitle">Note Title <span className="required">*</span></label>
            <input
              id="noteTitle"
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="e.g., React Hooks: useState, useEffect, & Custom Hooks"
              required
              maxLength={120}
              autoFocus
            />
          </div>

          <div className="form-row">
            <div className="form-group">
              <label htmlFor="noteCategory">Subject / Category <span className="required">*</span></label>
              <input
                id="noteCategory"
                type="text"
                list="categoryPresets"
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                placeholder="e.g., Web Development"
                required
              />
              <datalist id="categoryPresets">
                <option value="Web Development" />
                <option value="Data Structures & Algorithms" />
                <option value="Database Management (DBMS)" />
                <option value="Operating Systems" />
                <option value="Computer Networks" />
                <option value="Cloud & DevOps" />
                <option value="Personal Notes" />
              </datalist>
            </div>

            <div className="form-group">
              <label htmlFor="noteTags">Tags <small>(Comma-separated)</small></label>
              <input
                id="noteTags"
                type="text"
                value={tags}
                onChange={(e) => setTags(e.target.value)}
                placeholder="e.g., react, frontend, hooks, exam"
              />
            </div>
          </div>

          <div className="form-group">
            <div className="label-with-hint">
              <label htmlFor="noteContent">Note Content <span className="required">*</span></label>
              <span className="hint-text">Markdown syntax supported</span>
            </div>
            <textarea
              id="noteContent"
              rows={10}
              value={content}
              onChange={(e) => setContent(e.target.value)}
              placeholder="Write your lecture summary, key formulas, code snippets, or revision points here..."
              required
            />
          </div>

          {/* Footer */}
          <div className="modal-footer" style={{ margin: '0 -1.75rem -1.5rem', borderRadius: '0 0 var(--radius-xl) var(--radius-xl)' }}>
            <button type="button" className="btn btn-secondary" onClick={onClose} disabled={isSubmitting}>
              Cancel
            </button>
            <button type="submit" className="btn btn-primary" disabled={isSubmitting}>
              <Save size={16} />
              {isSubmitting ? 'Saving...' : (initialNote ? 'Update Note' : 'Save Note')}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
