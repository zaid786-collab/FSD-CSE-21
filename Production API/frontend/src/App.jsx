import React, { useState, useEffect } from 'react';
import './App.css';

// Base API URL: Uses Vite proxy (/api) in development or direct host
const API_BASE = '/api';

export function UserProfile() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const response = await fetch(`${API_BASE}/user`);
        if (response.ok) {
          const data = await response.json();
          setUser(data);
        }
      } catch (err) {
        console.error('Failed to load user profile:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchUser();
  }, []);

  if (loading) {
    return (
      <div className="user-profile-card">
        <div style={{ width: 120, height: 16, background: 'rgba(255,255,255,0.06)', borderRadius: 4 }} />
      </div>
    );
  }

  if (!user) return null;

  return (
    <div className="user-profile-card" title={`${user.role} • ${user.department || ''}`}>
      <img
        src={user.avatar || `https://api.dicebear.com/7.x/bottts/svg?seed=${user.name}`}
        alt={user.name}
        className="user-avatar"
      />
      <div className="user-info">
        <span className="user-name">{user.name}</span>
        <span className="user-role">{user.role}</span>
      </div>
    </div>
  );
}

const App = () => {
  const [products, setProducts] = useState([]);
  // Maintain user's variable alias setProduncts
  const setProduncts = setProducts;

  // Form States
  const [name, setName] = useState('');
  const [price, setPrice] = useState('');
  const [category, setCategory] = useState('Computing');
  const [stock, setStock] = useState('15');
  const [description, setDescription] = useState('');
  const [rating, setRating] = useState('4.8');
  const [editingId, setEditingId] = useState(null);

  // UI & Filter States
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [sortBy, setSortBy] = useState('default');
  const [loading, setLoading] = useState(false);
  const [stats, setStats] = useState({
    totalProducts: 0,
    totalStock: 0,
    totalInventoryValue: 0,
    averagePrice: 0,
    lowStockCount: 0
  });
  const [toast, setToast] = useState(null);

  // Show Toast Helper
  const showToast = (message, type = 'success') => {
    setToast({ message, type });
    setTimeout(() => {
      setToast(null);
    }, 3500);
  };

  // Fetch Stats from Backend
  const getStats = async () => {
    try {
      const response = await fetch(`${API_BASE}/stats`);
      if (response.ok) {
        const data = await response.json();
        setStats(data);
      }
    } catch (err) {
      console.error('Failed to fetch stats:', err);
    }
  };

  // Fetch Products from Backend with optional filters
  const getProducts = async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams();
      if (searchQuery.trim()) params.append('search', searchQuery.trim());
      if (selectedCategory !== 'All') params.append('category', selectedCategory);
      if (sortBy !== 'default') {
        if (sortBy === 'price-asc') {
          params.append('sortBy', 'price');
          params.append('order', 'asc');
        } else if (sortBy === 'price-desc') {
          params.append('sortBy', 'price');
          params.append('order', 'desc');
        } else if (sortBy === 'rating') {
          params.append('sortBy', 'rating');
          params.append('order', 'desc');
        } else if (sortBy === 'name') {
          params.append('sortBy', 'name');
          params.append('order', 'asc');
        }
      }

      const response = await fetch(`${API_BASE}/products?${params.toString()}`);
      if (!response.ok) throw new Error('Failed to fetch products');
      const data = await response.json();
      setProducts(data);
    } catch (err) {
      console.error('Error fetching products:', err);
      showToast('Error connecting to backend API', 'error');
    } finally {
      setLoading(false);
    }
  };

  // Initial load
  useEffect(() => {
    getProducts();
    getStats();
  }, [searchQuery, selectedCategory, sortBy]);

  // Reset form fields
  const resetForm = () => {
    setName('');
    setPrice('');
    setCategory('Computing');
    setStock('15');
    setDescription('');
    setRating('4.8');
    setEditingId(null);
    setIsModalOpen(false);
  };

  // Open Edit Product Modal
  const startEditProduct = (prod) => {
    setEditingId(prod.id);
    setName(prod.name);
    setPrice(prod.price.toString());
    setCategory(prod.category || 'Computing');
    setStock((prod.stock !== undefined ? prod.stock : 10).toString());
    setDescription(prod.description || '');
    setRating((prod.rating || 5.0).toString());
    setIsModalOpen(true);
  };

  // Add or Update Product
  const addProduct = async (e) => {
    e.preventDefault();

    if (!name.trim() || !price) {
      showToast('Please enter both name and price', 'error');
      return;
    }

    const productPayload = {
      name: name.trim(),
      price: parseFloat(price),
      category: category.trim(),
      stock: parseInt(stock, 10) || 0,
      description: description.trim(),
      rating: parseFloat(rating) || 5.0
    };

    try {
      let response;
      if (editingId) {
        // Update existing product
        response = await fetch(`${API_BASE}/products/${editingId}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(productPayload)
        });
      } else {
        // Create new product
        response = await fetch(`${API_BASE}/products`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(productPayload)
        });
      }

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.error || 'Failed to save product');
      }

      showToast(editingId ? 'Product updated successfully!' : 'New product created successfully!', 'success');
      resetForm();
      getProducts();
      getStats();
    } catch (err) {
      console.error('Error saving product:', err);
      showToast(err.message || 'Operation failed', 'error');
    }
  };

  // Delete Product
  const deleteProduct = async (id, prodName) => {
    if (!window.confirm(`Are you sure you want to delete "${prodName}"?`)) return;

    try {
      const response = await fetch(`${API_BASE}/products/${id}`, {
        method: 'DELETE'
      });
      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to delete product');
      }

      showToast(`"${prodName}" deleted successfully`, 'success');
      getProducts();
      getStats();
    } catch (err) {
      console.error('Delete error:', err);
      showToast(err.message || 'Failed to delete', 'error');
    }
  };

  // Reset Demo Data
  const resetDemoData = async () => {
    if (!window.confirm('Reset all products back to default inventory?')) return;
    try {
      const res = await fetch(`${API_BASE}/products/reset`, { method: 'POST' });
      if (res.ok) {
        showToast('Default inventory restored', 'success');
        getProducts();
        getStats();
      }
    } catch (err) {
      showToast('Failed to reset inventory', 'error');
    }
  };

  const categories = ['All', 'Computing', 'Audio', 'Accessories', 'Wearables'];

  const getCategoryClass = (cat) => {
    const c = (cat || '').toLowerCase();
    if (c === 'computing') return 'tag-computing';
    if (c === 'audio') return 'tag-audio';
    if (c === 'wearables') return 'tag-wearables';
    if (c === 'accessories') return 'tag-accessories';
    return 'tag-default';
  };

  return (
    <div className="dashboard-container">
      {/* Toast Notification */}
      {toast && (
        <div className="toast-container">
          <div className={`toast ${toast.type === 'error' ? 'toast-error' : 'toast-success'}`}>
            <span>{toast.type === 'error' ? '⚠️' : '✅'}</span>
            <span>{toast.message}</span>
          </div>
        </div>
      )}

      {/* Top Header */}
      <header className="dashboard-header">
        <div className="brand-section">
          <div className="brand-logo-icon">⚡</div>
          <div className="brand-text">
            <h1>Production API</h1>
          </div>
        </div>

        <div className="header-actions">
          <button 
            className="btn-secondary" 
            onClick={resetDemoData}
            title="Reset catalog to sample items"
          >
            ↻ Reset Demo Data
          </button>
          <UserProfile />
        </div>
      </header>

      {/* Overview Stats Grid */}
      <section className="stats-grid">
        <div className="stat-card">
          <div className="stat-header">
            <span className="stat-title">Total Products</span>
            <span className="stat-icon" style={{ background: 'rgba(99, 102, 241, 0.15)', color: '#818cf8' }}>📦</span>
          </div>
          <div className="stat-value">{stats.totalProducts}</div>
          <div className="stat-footer">Across active categories</div>
        </div>

        <div className="stat-card">
          <div className="stat-header">
            <span className="stat-title">Inventory Value</span>
            <span className="stat-icon" style={{ background: 'rgba(16, 185, 129, 0.15)', color: '#10b981' }}>💎</span>
          </div>
          <div className="stat-value">
            ₹{stats.totalInventoryValue ? stats.totalInventoryValue.toLocaleString('en-IN', { minimumFractionDigits: 2 }) : '0.00'}
          </div>
          <div className="stat-footer">Total in-stock asset evaluation</div>
        </div>

        <div className="stat-card">
          <div className="stat-header">
            <span className="stat-title">Average Price</span>
            <span className="stat-icon" style={{ background: 'rgba(6, 182, 212, 0.15)', color: '#06b6d4' }}>🏷️</span>
          </div>
          <div className="stat-value">
            ₹{stats.averagePrice ? stats.averagePrice.toLocaleString('en-IN', { minimumFractionDigits: 2 }) : '0.00'}
          </div>
          <div className="stat-footer">Per unit average retail</div>
        </div>

        <div className="stat-card">
          <div className="stat-header">
            <span className="stat-title">Low Stock Alert</span>
            <span className="stat-icon" style={{ background: 'rgba(244, 63, 94, 0.15)', color: '#f43f5e' }}>⚠️</span>
          </div>
          <div className="stat-value" style={{ color: stats.lowStockCount > 0 ? '#f43f5e' : 'inherit' }}>
            {stats.lowStockCount}
          </div>
          <div className="stat-footer">Items with fewer than 10 units</div>
        </div>
      </section>

      {/* Control Bar: Search, Filter, Sort, New Product */}
      <section className="control-bar">
        <div className="control-row">
          <div className="search-input-wrapper">
            <span className="search-icon">🔍</span>
            <input
              type="text"
              className="search-input"
              placeholder="Search products by name, tag, or description..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>

          <div className="filter-actions">
            <select
              className="select-dropdown"
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
            >
              <option value="default">Sort by Default</option>
              <option value="name">Sort by Name (A-Z)</option>
              <option value="price-asc">Price: Low to High</option>
              <option value="price-desc">Price: High to Low</option>
              <option value="rating">Highest Rated</option>
            </select>

            <button
              className="btn-primary"
              onClick={() => {
                resetForm();
                setIsModalOpen(true);
              }}
            >
              <span>+</span> Add Product
            </button>
          </div>
        </div>

        {/* Category Pills */}
        <div className="category-pills">
          {categories.map((cat) => (
            <button
              key={cat}
              className={`pill-btn ${selectedCategory === cat ? 'active' : ''}`}
              onClick={() => setSelectedCategory(cat)}
            >
              {cat}
            </button>
          ))}
        </div>
      </section>

      {/* Product Grid / Table */}
      <main>
        {loading ? (
          <div className="empty-state">
            <div className="status-dot" style={{ width: 14, height: 14 }}></div>
            <p>Loading catalog from REST API...</p>
          </div>
        ) : products.length === 0 ? (
          <div className="empty-state">
            <div className="empty-icon">📂</div>
            <h3>No products found</h3>
            <p style={{ color: 'var(--text-muted)' }}>
              {searchQuery ? `No matches for "${searchQuery}"` : 'Your product inventory is currently empty.'}
            </p>
            <button
              className="btn-secondary"
              onClick={() => {
                setSearchQuery('');
                setSelectedCategory('All');
              }}
            >
              Clear Search Filters
            </button>
          </div>
        ) : (
          <div className="products-grid">
            {products.map((prod) => (
              <div key={prod.id} className="product-card">
                <div>
                  <div className="product-top">
                    <span className={`category-tag ${getCategoryClass(prod.category)}`}>
                      {prod.category}
                    </span>
                    <span className="rating-badge">
                      ★ {prod.rating ? Number(prod.rating).toFixed(1) : '5.0'}
                    </span>
                  </div>

                  <h3 className="product-name" style={{ marginTop: 12 }}>{prod.name}</h3>
                  <p className="product-desc" style={{ marginTop: 6 }}>
                    {prod.description || 'Enterprise-grade item manufactured to rigorous standards.'}
                  </p>
                </div>

                <div>
                  <div className="product-meta">
                    <div className="product-price">
                      ₹{Number(prod.price).toLocaleString('en-IN', { minimumFractionDigits: 2 })}
                    </div>
                    <span className={`stock-tag ${prod.stock < 10 ? 'stock-low' : 'stock-good'}`}>
                      {prod.stock !== undefined ? `${prod.stock} in stock` : 'Available'}
                    </span>
                  </div>

                  <div className="product-actions" style={{ marginTop: 14 }}>
                    <button
                      className="btn-edit-subtle"
                      onClick={() => startEditProduct(prod)}
                      title="Edit this product"
                    >
                      ✏️ Edit
                    </button>
                    <button
                      className="btn-danger-subtle"
                      onClick={() => deleteProduct(prod.id, prod.name)}
                      title="Delete this product"
                    >
                      🗑️ Delete
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </main>

      {/* Modal: Add / Edit Product */}
      {isModalOpen && (
        <div className="modal-overlay" onClick={() => setIsModalOpen(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h2>{editingId ? 'Edit Product' : 'Add New Product'}</h2>
              <button className="btn-close" onClick={() => setIsModalOpen(false)}>✕</button>
            </div>

            <form onSubmit={addProduct}>
              <div className="modal-body">
                <div className="form-group">
                  <label className="form-label">Product Name *</label>
                  <input
                    type="text"
                    required
                    className="form-input"
                    placeholder="e.g. Dell UltraSharp 32 4K Monitor"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                  />
                </div>

                <div className="form-row">
                  <div className="form-group">
                    <label className="form-label">Price (₹) *</label>
                    <input
                      type="number"
                      step="0.01"
                      min="0"
                      required
                      className="form-input"
                      placeholder="₹ 0.00"
                      value={price}
                      onChange={(e) => setPrice(e.target.value)}
                    />
                  </div>

                  <div className="form-group">
                    <label className="form-label">Category *</label>
                    <select
                      className="form-input"
                      value={category}
                      onChange={(e) => setCategory(e.target.value)}
                    >
                      <option value="Computing">Computing</option>
                      <option value="Audio">Audio</option>
                      <option value="Accessories">Accessories</option>
                      <option value="Wearables">Wearables</option>
                      <option value="Mobile">Mobile</option>
                      <option value="Gaming">Gaming</option>
                    </select>
                  </div>
                </div>

                <div className="form-row">
                  <div className="form-group">
                    <label className="form-label">Stock Units</label>
                    <input
                      type="number"
                      min="0"
                      className="form-input"
                      value={stock}
                      onChange={(e) => setStock(e.target.value)}
                    />
                  </div>

                  <div className="form-group">
                    <label className="form-label">Rating (1.0 - 5.0)</label>
                    <input
                      type="number"
                      step="0.1"
                      min="1"
                      max="5"
                      className="form-input"
                      value={rating}
                      onChange={(e) => setRating(e.target.value)}
                    />
                  </div>
                </div>

                <div className="form-group">
                  <label className="form-label">Description</label>
                  <textarea
                    rows="3"
                    className="form-textarea"
                    placeholder="Enter key technical specifications or features..."
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                  />
                </div>
              </div>

              <div className="modal-footer">
                <button
                  type="button"
                  className="btn-secondary"
                  onClick={() => setIsModalOpen(false)}
                >
                  Cancel
                </button>
                <button type="submit" className="btn-primary">
                  {editingId ? 'Save Changes' : 'Create Product'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default App;
