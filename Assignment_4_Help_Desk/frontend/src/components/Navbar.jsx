import React, { useState } from "react";

function Navbar({ onOpenReport, requestsCount }) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const scrollToRequests = () => {
    const el = document.getElementById("requests-section");
    if (el) {
      el.scrollIntoView({ behavior: "smooth" });
    }
    setMobileMenuOpen(false);
  };

  return (
    <nav className="top-nav">
      <div className="nav-container">
        {/* Brand / Logo */}
        <div className="brand" onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}>
          <span className="brand-symbol">◈</span>
          <div className="brand-text">
            <span className="brand-name">CAMPUS</span>
            <span className="brand-sub">HELP DESK</span>
          </div>
        </div>

        {/* Desktop Navigation Links & Action */}
        <div className="nav-actions">
          <button type="button" className="nav-link" onClick={scrollToRequests}>
            Requests <span className="nav-pill">{requestsCount}</span>
          </button>
          <button type="button" className="btn btn-gold" onClick={onOpenReport}>
            + Report Problem
          </button>
        </div>

        {/* Mobile Hamburger Button */}
        <button
          type="button"
          className="mobile-toggle"
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          aria-label="Toggle navigation menu"
        >
          {mobileMenuOpen ? "✕" : "☰"}
        </button>
      </div>

      {/* Mobile Menu Dropdown */}
      {mobileMenuOpen && (
        <div className="mobile-menu">
          <button type="button" className="mobile-link" onClick={scrollToRequests}>
            View Requests ({requestsCount})
          </button>
          <button
            type="button"
            className="btn btn-gold btn-block"
            onClick={() => {
              setMobileMenuOpen(false);
              onOpenReport();
            }}
          >
            + Report Problem
          </button>
        </div>
      )}
    </nav>
  );
}

export default Navbar;
