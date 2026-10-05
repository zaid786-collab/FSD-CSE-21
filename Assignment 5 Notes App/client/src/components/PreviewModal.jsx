import React from 'react';
import { X, Copy, Printer, Download, FileText, Code2, Calendar, PenTool } from 'lucide-react';

export default function PreviewModal({
  note,
  onClose,
  onDownload,
  onCopy
}) {
  if (!note) return null;

  const formattedDate = new Date(note.updatedAt || note.createdAt).toLocaleDateString('en-US', {
    month: 'long',
    day: 'numeric',
    year: 'numeric'
  });

  const wordCount = (note.content || '').trim().split(/\s+/).filter(Boolean).length;

  return (
    <div className="modal-overlay" onClick={onClose} role="dialog" aria-modal="true">
      <div className="modal-container preview-modal-container" onClick={(e) => e.stopPropagation()}>
        {/* Modal Header */}
        <div className="modal-header">
          <div className="modal-badge-group">
            <span className="category-badge">{note.category}</span>
            <span className="note-date">
              <Calendar size={13} /> {formattedDate}
            </span>
          </div>

          <div className="modal-header-actions">
            <button 
              className="btn-icon" 
              onClick={() => onCopy(note.content)} 
              title="Copy note content"
            >
              <Copy size={16} />
            </button>
            <button 
              className="btn-icon" 
              onClick={() => window.print()} 
              title="Print / Save to PDF"
            >
              <Printer size={16} />
            </button>
            <button 
              className="btn-icon" 
              onClick={onClose} 
              title="Close modal"
            >
              <X size={18} />
            </button>
          </div>
        </div>

        {/* Modal Body */}
        <div className="modal-body">
          <h2 className="preview-title">{note.title}</h2>
          
          <div className="tag-list">
            {(note.tags || []).map((t, idx) => (
              <span key={idx} className="tag-item">#{t}</span>
            ))}
          </div>

          <hr className="preview-divider" />

          <div className="preview-content-box">
            {note.content}
          </div>
        </div>

        {/* Modal Footer */}
        <div className="modal-footer preview-footer">
          <div className="preview-metrics">
            <span>
              <PenTool size={14} /> {wordCount} words
            </span>
            <span>
              <Download size={14} /> {note.downloads || 0} downloads
            </span>
          </div>

          <div className="preview-download-buttons">
            <button
              className="btn btn-secondary"
              onClick={() => onDownload(note.id, 'txt')}
            >
              <FileText size={16} /> Download .TXT
            </button>
            <button
              className="btn btn-primary"
              onClick={() => onDownload(note.id, 'md')}
            >
              <Code2 size={16} /> Download .MD
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
