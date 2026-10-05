import React, { useState } from 'react';
import { Calendar, Download, ChevronDown, FileText, Code2, Copy, Pen, Trash2 } from 'lucide-react';

function getCategoryBadgeClass(category = '') {
  const cat = category.toLowerCase();
  if (cat.includes('web')) return 'badge-web-development';
  if (cat.includes('struct') || cat.includes('algo')) return 'badge-data-structures';
  if (cat.includes('dbms') || cat.includes('database')) return 'badge-dbms';
  return '';
}

function highlightQuery(text, query) {
  if (!query || !query.trim() || !text) return text;
  const terms = query.trim().split(/\s+/).filter(Boolean);
  if (!terms.length) return text;

  // Escape regex
  const escaped = terms.map(t => t.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')).join('|');
  const regex = new RegExp(`(${escaped})`, 'gi');
  const parts = text.split(regex);

  return parts.map((part, index) => 
    regex.test(part) ? (
      <mark key={index} className="highlight">{part}</mark>
    ) : (
      part
    )
  );
}

function cleanSnippet(content = '', maxLength = 160) {
  const clean = content
    .replace(/#+\s/g, '')
    .replace(/```[a-z]*\n[\s\S]*?\n```/g, '[Code Snippet] ')
    .replace(/`([^`]+)`/g, '$1')
    .replace(/\[([^\]]+)\]\([^\)]+\)/g, '$1')
    .replace(/\*\*|__/g, '')
    .replace(/\*|_/g, '')
    .replace(/\|.*\|/g, '')
    .trim();

  if (clean.length <= maxLength) return clean;
  return clean.substring(0, maxLength) + '...';
}

function getWordCount(content = '') {
  return content.trim().split(/\s+/).filter(Boolean).length;
}

export default function NoteCard({
  note,
  searchQuery,
  onPreview,
  onDownload,
  onCopy,
  onEdit,
  onDelete
}) {
  const [dropdownOpen, setDropdownOpen] = useState(false);

  const formattedDate = new Date(note.updatedAt || note.createdAt).toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric'
  });

  const categoryClass = getCategoryBadgeClass(note.category);
  const snippet = cleanSnippet(note.content);

  return (
    <article className="note-card">
      <div className="note-card-top">
        <span className={`category-badge ${categoryClass}`}>{note.category}</span>
        <span className="note-date">
          <Calendar size={13} /> {formattedDate}
        </span>
      </div>

      <h3 
        className="note-title" 
        onClick={() => onPreview(note)} 
        title="Click to view details and preview"
      >
        {highlightQuery(note.title, searchQuery)}
      </h3>

      <p className="note-snippet">
        {highlightQuery(snippet, searchQuery)}
      </p>

      <div className="tag-list">
        {(note.tags || []).map((tag, idx) => (
          <span key={idx} className="tag-item">#{tag}</span>
        ))}
      </div>

      <div className="note-card-footer">
        <div className="note-card-meta">
          <span title="Total downloads">
            <Download size={13} /> {note.downloads || 0}
          </span>
          <span title="Approximate word count">
            <FileText size={13} /> {getWordCount(note.content)}w
          </span>
        </div>

        <div className="note-card-actions">
          {/* Direct Download Split Button */}
          <div className="download-btn-group">
            <button
              className="btn-download-primary"
              onClick={() => onDownload(note.id, 'txt')}
              title="Download Note (.txt)"
            >
              <Download size={13} /> TXT
            </button>
            <button
              className="btn-download-menu"
              onClick={() => setDropdownOpen(!dropdownOpen)}
              title="More formats"
            >
              <ChevronDown size={14} />
            </button>

            {dropdownOpen && (
              <div className="download-dropdown" onMouseLeave={() => setDropdownOpen(false)}>
                <button
                  className="dropdown-item"
                  onClick={() => {
                    setDropdownOpen(false);
                    onDownload(note.id, 'txt');
                  }}
                >
                  <FileText size={14} /> Plain Text (.txt)
                </button>
                <button
                  className="dropdown-item"
                  onClick={() => {
                    setDropdownOpen(false);
                    onDownload(note.id, 'md');
                  }}
                >
                  <Code2 size={14} /> Markdown (.md)
                </button>
                <button
                  className="dropdown-item"
                  onClick={() => {
                    setDropdownOpen(false);
                    onCopy(note.content);
                  }}
                >
                  <Copy size={14} /> Copy to Clipboard
                </button>
              </div>
            )}
          </div>

          <button
            className="card-action-icon"
            onClick={() => onEdit(note)}
            title="Edit Note"
          >
            <Pen size={15} />
          </button>

          <button
            className="card-action-icon danger"
            onClick={() => onDelete(note)}
            title="Delete Note"
          >
            <Trash2 size={15} />
          </button>
        </div>
      </div>
    </article>
  );
}
