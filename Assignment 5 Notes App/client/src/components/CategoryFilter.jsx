import React from 'react';
import { LayoutGrid, ArrowDownWideNarrow, RotateCcw } from 'lucide-react';

export default function CategoryFilter({
  categories,
  activeCategory,
  onSelectCategory,
  sortBy,
  onSortChange,
  resultsCount,
  isFiltered,
  onResetFilters
}) {
  const totalCount = categories.reduce((acc, curr) => acc + curr.count, 0);

  return (
    <>
      <section className="filter-bar">
        {/* Category Chips Scroll */}
        <div className="category-chips-scroll">
          <button
            className={`category-chip ${activeCategory === 'all' ? 'active' : ''}`}
            onClick={() => onSelectCategory('all')}
          >
            <LayoutGrid size={14} /> All Notes
            <span className="category-count">{totalCount}</span>
          </button>

          {categories.map((cat) => (
            <button
              key={cat.name}
              className={`category-chip ${activeCategory.toLowerCase() === cat.name.toLowerCase() ? 'active' : ''}`}
              onClick={() => onSelectCategory(cat.name)}
            >
              {cat.name}
              <span className="category-count">{cat.count}</span>
            </button>
          ))}
        </div>

        {/* Sort Controls */}
        <div className="filter-controls">
          <div className="sort-wrapper">
            <ArrowDownWideNarrow size={15} />
            <label htmlFor="sortSelect">Sort:</label>
            <select
              id="sortSelect"
              className="custom-select"
              value={sortBy}
              onChange={(e) => onSortChange(e.target.value)}
            >
              <option value="newest">Recently Updated</option>
              <option value="oldest">Oldest First</option>
              <option value="title-asc">Title (A - Z)</option>
              <option value="title-desc">Title (Z - A)</option>
              <option value="downloads">Most Downloaded</option>
            </select>
          </div>
        </div>
      </section>

      {/* Results Header */}
      <div className="results-header">
        <div className="results-count">
          {isFiltered ? (
            <>
              Found <strong>{resultsCount}</strong> matching notes
              {activeCategory !== 'all' && (
                <> in <em>{activeCategory}</em></>
              )}
            </>
          ) : (
            <>Showing all <strong>{resultsCount}</strong> notes</>
          )}
        </div>

        {isFiltered && (
          <button className="btn-text" onClick={onResetFilters}>
            <RotateCcw size={14} /> Reset Search & Filters
          </button>
        )}
      </div>
    </>
  );
}
