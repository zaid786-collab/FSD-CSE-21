import React from 'react';
import { BookMarked, Moon, Sun, Archive, Plus } from 'lucide-react';

export default function Header({ theme, onToggleTheme, onExportAll, onOpenCreateModal }) {
  return (
    <header className="header">
      <div className="container header-container">
        <div className="logo-group">
          <div className="logo-icon">
            <BookMarked size={24} />
          </div>
          <div className="logo-text">
            <h1>Note<span>Vault</span></h1>
            <p className="tagline">
              React & Express <span className="tagline-badge">v2.0</span>
            </p>
          </div>
        </div>

        <div className="header-actions">
          <button 
            className="btn-icon" 
            onClick={onToggleTheme} 
            title={`Switch to ${theme === 'dark' ? 'light' : 'dark'} mode`}
            aria-label="Toggle Theme"
          >
            {theme === 'dark' ? <Moon size={18} /> : <Sun size={18} />}
          </button>
          
          <button 
            className="btn btn-secondary" 
            onClick={onExportAll} 
            title="Download all notes in a single markdown file"
          >
            <Archive size={16} />
            <span>Backup All</span>
          </button>

          <button 
            className="btn btn-primary" 
            onClick={onOpenCreateModal}
          >
            <Plus size={18} />
            <span>Create Note</span>
          </button>
        </div>
      </div>
    </header>
  );
}
