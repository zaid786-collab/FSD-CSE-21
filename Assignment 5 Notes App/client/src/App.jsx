import React, { useState, useEffect } from 'react';
import { jsPDF } from 'jspdf';

const API_BASE = '/api';

export default function App() {
  const [notes, setNotes] = useState([]);
  const [search, setSearch] = useState('');
  const [selectedSubject, setSelectedSubject] = useState('All');
  const [showAddModal, setShowAddModal] = useState(false);

  // New Note State
  const [newTitle, setNewTitle] = useState('');
  const [newSubject, setNewSubject] = useState('Web Development');
  const [newTopics, setNewTopics] = useState('');
  const [newContent, setNewContent] = useState('');

  // Fetch notes from Express backend
  const fetchNotes = async () => {
    try {
      const res = await fetch(`${API_BASE}/notes`);
      if (res.ok) {
        const data = await res.json();
        setNotes(data.notes || []);
      }
    } catch (err) {
      console.log('Backend not reached, using offline state:', err);
    }
  };

  useEffect(() => {
    fetchNotes();
  }, []);

  // Filter notes
  const filteredNotes = notes.filter((note) => {
    const subj = note.subject || note.category || 'General';
    const matchesSubject =
      selectedSubject === 'All' || subj.toLowerCase() === selectedSubject.toLowerCase();

    const q = search.toLowerCase().trim();
    const topicsStr = (note.topics || []).join(' ').toLowerCase();
    const matchesSearch =
      !q ||
      note.title.toLowerCase().includes(q) ||
      note.content.toLowerCase().includes(q) ||
      subj.toLowerCase().includes(q) ||
      topicsStr.includes(q);

    return matchesSubject && matchesSearch;
  });

  // Unique subjects
  const subjects = ['All', ...new Set(notes.map((n) => n.subject || n.category || 'General'))];

  // Direct PDF Download
  const handleDownloadPdf = async (note) => {
    try {
      // 1. Try downloading generated PDF directly from Express backend
      const res = await fetch(`${API_BASE}/notes/${note.id}/download`);
      if (res.ok) {
        const blob = await res.blob();
        const safeTitle = (note.title || 'notes').replace(/[^a-zA-Z0-9_-]/g, '_');
        const filename = `${safeTitle}.pdf`;

        const link = document.createElement('a');
        link.href = window.URL.createObjectURL(blob);
        link.download = filename;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        window.URL.revokeObjectURL(link.href);

        fetchNotes();
        return;
      }
    } catch (err) {
      console.log('Falling back to client-side jsPDF generator');
    }

    // 2. Client-side fallback with jsPDF
    const doc = new jsPDF();
    doc.setFontSize(16);
    doc.text(note.title, 15, 20);
    doc.setFontSize(11);
    doc.setTextColor(100);
    doc.text(`Subject: ${note.subject || 'General'}  |  Semester: 3rd Sem`, 15, 28);
    doc.setDrawColor(200);
    doc.line(15, 33, 195, 33);

    doc.setFontSize(10);
    doc.setTextColor(30);
    const splitText = doc.splitTextToSize(note.content, 180);
    doc.text(splitText, 15, 42);

    const safeTitle = (note.title || 'notes').replace(/[^a-zA-Z0-9_-]/g, '_');
    doc.save(`${safeTitle}.pdf`);
  };

  // Open PDF directly in browser tab to view
  const handleViewPdf = (noteId) => {
    window.open(`${API_BASE}/notes/${noteId}/view`, '_blank');
  };

  // Delete note
  const handleDeleteNote = async (id, title) => {
    if (!window.confirm(`Delete PDF note: "${title}"?`)) return;

    try {
      const res = await fetch(`${API_BASE}/notes/${id}`, { method: 'DELETE' });
      if (res.ok) {
        fetchNotes();
      }
    } catch (err) {
      alert('Failed to delete note');
    }
  };

  // Add new PDF note
  const handleAddNote = async (e) => {
    e.preventDefault();
    if (!newTitle.trim() || !newContent.trim()) return;

    try {
      const res = await fetch(`${API_BASE}/notes`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title: newTitle.trim(),
          subject: newSubject.trim(),
          topics: newTopics.split(',').map((t) => t.trim()).filter(Boolean),
          content: newContent.trim()
        })
      });

      if (res.ok) {
        setNewTitle('');
        setNewTopics('');
        setNewContent('');
        setShowAddModal(false);
        fetchNotes();
      }
    } catch (err) {
      alert('Could not add note');
    }
  };

  return (
    <div className="container">
      {/* Header */}
      <header className="app-header">
        <div>
          <h1>College Notes PDF Portal</h1>
          <p>Search particular subject notes and download them as PDF documents</p>
        </div>
        <div>
          <button className="btn btn-primary btn-sm" onClick={() => setShowAddModal(true)}>
            + Add PDF Note
          </button>
        </div>
      </header>

      {/* Search & Subject Filter */}
      <div className="search-section">
        <div className="search-input-group">
          <input
            type="text"
            className="search-input"
            placeholder="Search PDF notes by topic, unit, subject, or keywords (e.g., 'flexbox', 'normalization', 'binary tree')..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
          {search && (
            <button className="btn btn-secondary btn-sm" onClick={() => setSearch('')}>
              Clear
            </button>
          )}
        </div>

        {/* Subject Pills */}
        <div className="category-filter">
          {subjects.map((subj) => (
            <button
              key={subj}
              className={`cat-btn ${selectedSubject === subj ? 'active' : ''}`}
              onClick={() => setSelectedSubject(subj)}
            >
              {subj}
            </button>
          ))}
        </div>
      </div>

      {/* Results Header */}
      <div style={{ marginBottom: '12px', fontSize: '14px', color: '#666' }}>
        Found <strong>{filteredNotes.length}</strong> PDF note{filteredNotes.length !== 1 ? 's' : ''}
      </div>

      {/* Notes List */}
      {filteredNotes.length === 0 ? (
        <div className="empty-box">
          <p>No PDF notes found matching your search query.</p>
          <button
            className="btn btn-primary btn-sm"
            style={{ marginTop: '10px' }}
            onClick={() => setShowAddModal(true)}
          >
            Add a New PDF Note
          </button>
        </div>
      ) : (
        <div className="notes-list">
          {filteredNotes.map((note) => (
            <div key={note.id} className="note-card">
              <div className="note-card-header">
                <div>
                  <span className="pdf-tag">PDF</span>
                  <span className="note-title">{note.title}</span>
                </div>
                <span className="note-badge">{note.subject || note.category}</span>
              </div>

              {/* Meta information: Pages & File Size */}
              <div className="note-meta-row">
                <span>📄 {note.pages || 4} Pages</span>
                <span>•</span>
                <span>📦 {note.fileSize || '150 KB'}</span>
                <span>•</span>
                <span>📅 {note.createdAt || '2026'}</span>
                <span>•</span>
                <span>📥 {note.downloads || 0} Downloads</span>
              </div>

              {/* Topics tags */}
              {note.topics && note.topics.length > 0 && (
                <div className="topics-row">
                  {note.topics.map((topic, i) => (
                    <span key={i} className="topic-chip">
                      {topic}
                    </span>
                  ))}
                </div>
              )}

              {/* Note Content Preview */}
              <div className="note-content">{note.content}</div>

              {/* Actions */}
              <div className="note-actions">
                <span style={{ fontSize: '13px', color: '#666' }}>
                  Format: <strong>Adobe PDF (.pdf)</strong>
                </span>

                <div className="action-buttons">
                  <button
                    className="btn btn-secondary btn-sm"
                    onClick={() => handleViewPdf(note.id)}
                    title="View PDF directly in browser"
                  >
                    View PDF
                  </button>
                  <button
                    className="btn btn-primary btn-sm"
                    onClick={() => handleDownloadPdf(note)}
                    title="Download Note as PDF file"
                  >
                    Download PDF
                  </button>
                  <button
                    className="btn btn-danger btn-sm"
                    onClick={() => handleDeleteNote(note.id, note.title)}
                  >
                    Delete
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Add PDF Note Modal */}
      {showAddModal && (
        <div className="modal-overlay" onClick={() => setShowAddModal(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <h2>Add New PDF Note</h2>
            <form onSubmit={handleAddNote}>
              <div className="form-group">
                <label>Note / Document Title *</label>
                <input
                  type="text"
                  className="form-control"
                  placeholder="e.g. Unit 3: Database Normalization (1NF, 2NF, 3NF)"
                  value={newTitle}
                  onChange={(e) => setNewTitle(e.target.value)}
                  required
                />
              </div>

              <div className="form-group">
                <label>Subject</label>
                <input
                  type="text"
                  className="form-control"
                  placeholder="e.g. Web Development, DBMS, Data Structures"
                  value={newSubject}
                  onChange={(e) => setNewSubject(e.target.value)}
                />
              </div>

              <div className="form-group">
                <label>Key Topics (Comma-separated)</label>
                <input
                  type="text"
                  className="form-control"
                  placeholder="e.g. 1NF, 2NF, BCNF, Relational Algebra"
                  value={newTopics}
                  onChange={(e) => setNewTopics(e.target.value)}
                />
              </div>

              <div className="form-group">
                <label>Note Content (Will be formatted into the PDF) *</label>
                <textarea
                  className="form-control"
                  rows={8}
                  placeholder="Paste or write the syllabus text, definitions, formulas, or summaries..."
                  value={newContent}
                  onChange={(e) => setNewContent(e.target.value)}
                  required
                />
              </div>

              <div className="modal-actions">
                <button
                  type="button"
                  className="btn btn-secondary btn-sm"
                  onClick={() => setShowAddModal(false)}
                >
                  Cancel
                </button>
                <button type="submit" className="btn btn-primary btn-sm">
                  Create PDF Note
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
