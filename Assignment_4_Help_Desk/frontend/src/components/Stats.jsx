import React from "react";

function Stats({ requests, activeFilter, onSelectFilter }) {
  const total = requests.length;
  const high = requests.filter((r) => r.priority === "High").length;
  // Dynamic calculation for "Your Requests" (or active inquiries)
  const activeCount = total;

  const pad = (num) => (num < 10 ? `0${num}` : `${num}`);

  return (
    <section className="stats-row">
      {/* 1. Total Requests */}
      <div
        className={`stat-item ${activeFilter === "All" ? "stat-item-active" : ""}`}
        onClick={() => onSelectFilter("All")}
        role="button"
        tabIndex={0}
      >
        <div className="stat-number">{pad(total)}</div>
        <div className="stat-title">TOTAL REQUESTS</div>
        <div className="stat-accent-line"></div>
      </div>

      {/* 2. High Priority */}
      <div
        className={`stat-item ${activeFilter === "High" ? "stat-item-active" : ""}`}
        onClick={() => onSelectFilter("High")}
        role="button"
        tabIndex={0}
      >
        <div className="stat-number stat-high">{pad(high)}</div>
        <div className="stat-title">HIGH PRIORITY</div>
        <div className="stat-accent-line"></div>
      </div>

      {/* 3. Your Requests */}
      <div
        className="stat-item"
        onClick={() => onSelectFilter("All")}
        role="button"
        tabIndex={0}
      >
        <div className="stat-number">{pad(activeCount)}</div>
        <div className="stat-title">YOUR REQUESTS</div>
        <div className="stat-accent-line"></div>
      </div>
    </section>
  );
}

export default Stats;
