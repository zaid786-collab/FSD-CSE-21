import React, { useRef, useEffect } from 'react';
import { Search, X, Zap, FileText, Download, Layers } from 'lucide-react';

export default function HeroSearch({ 
  searchQuery, 
  onSearchChange, 
  onClearSearch, 
  totalNotes, 
  totalDownloads, 
  totalSubjects 
}) {
  const inputRef = useRef(null);

  useEffect(() => {
    const handleKeyDown = (e) => {
      if ((e.key === '/' || (e.ctrlKey && e.key.toLowerCase() === 'k')) && 
          document.activeElement !== inputRef.current &&
          document.activeElement.tagName !== 'INPUT' &&
          document.activeElement.tagName !== 'TEXTAREA') {
        e.preventDefault();
        inputRef.current?.focus();
        inputRef.current?.select();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  return (
    <section className="hero-section">
      <div className="hero-badge">
        <Zap size={14} /> Fullstack React + Express Notes Repository
      </div>
      <h2 className="hero-title">
        Find Any Note and <span className="gradient-text">Download Instantly</span>
      </h2>
      <p className="hero-subtitle">
        Instant search across lecture notes, algorithms, summaries, and code snippets. One-click export to TXT, Markdown, or PDF.
      </p>

      {/* Live Search Bar */}
      <div className="search-box-wrapper">
        <div className="search-box">
          <Search size={20} className="search-icon" />
          <input
            ref={inputRef}
            type="text"
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            placeholder="Search notes by title, topic, formula, or content (e.g. 'flexbox', 'DBMS', 'binary tree')..."
            autoComplete="off"
            spellCheck="false"
          />
          {searchQuery && (
            <button 
              className="clear-search-btn" 
              onClick={onClearSearch}
              title="Clear Search"
            >
              <X size={16} />
            </button>
          )}
          <span className="kbd" title="Press / or Ctrl+K to search">/</span>
        </div>
      </div>

      {/* Live Counters */}
      <div className="stats-row">
        <div className="stat-pill">
          <FileText size={15} />
          <span>{totalNotes}</span> Notes Available
        </div>
        <div className="stat-pill">
          <Download size={15} />
          <span>{totalDownloads}</span> Total Downloads
        </div>
        <div className="stat-pill">
          <Layers size={15} />
          <span>{totalSubjects}</span> Subjects
        </div>
      </div>
    </section>
  );
}
