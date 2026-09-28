import React from "react";

function Hero({ onOpenReport }) {
  return (
    <header className="hero-section">
      <div className="hero-content">
        <div className="hero-badge">
          <span className="badge-bullet">◈</span>
          <span>CAMPUS SUPPORT</span>
        </div>

        <h1 className="hero-title">
          Need something fixed?
          <span className="hero-title-accent">We're here to help.</span>
        </h1>

        <p className="hero-subtitle">
          Report campus problems quickly and keep track of your requests in one place.
        </p>

        <div className="hero-actions">
          <button type="button" className="btn btn-gold btn-lg" onClick={onOpenReport}>
            + Report a Problem
          </button>
        </div>

        {/* Decorative Gold Accent Element */}
        <div className="hero-divider">
          <span className="divider-line"></span>
          <span className="divider-diamond">◇</span>
          <span className="divider-line"></span>
        </div>
      </div>
    </header>
  );
}

export default Hero;
