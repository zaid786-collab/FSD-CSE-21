import React, { useState, useEffect } from "react";
import Navbar from "./components/Navbar";
import Hero from "./components/Hero";
import Stats from "./components/Stats";
import RequestCard from "./components/RequestCard";
import RequestModal from "./components/RequestModal";
import DeleteModal from "./components/DeleteModal";
import DetailsModal from "./components/DetailsModal";
import Toast from "./components/Toast";
import "./App.css";

const API_BASE = "http://localhost:5000/api/requests";

function App() {
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  // Modals state
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingRequest, setEditingRequest] = useState(null);
  const [deletingRequest, setDeletingRequest] = useState(null);
  const [viewingRequest, setViewingRequest] = useState(null);

  // Filter & Search
  const [searchQuery, setSearchQuery] = useState("");
  const [priorityFilter, setPriorityFilter] = useState("All");

  // Toast notification
  const [toast, setToast] = useState(null);

  const showToast = (message, type = "success") => {
    setToast({ message, type });
    setTimeout(() => {
      setToast(null);
    }, 4000);
  };

  // -----------------------------------------------------------
  // 1. GET Requests
  // -----------------------------------------------------------
  const fetchRequests = async () => {
    try {
      setLoading(true);
      const res = await fetch(API_BASE);
      if (!res.ok) {
        throw new Error("Unable to fetch campus requests.");
      }
      const data = await res.json();
      setRequests(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error("fetchRequests error:", err);
      showToast("! Something went wrong connecting to the server", "error");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRequests();
  }, []);

  // -----------------------------------------------------------
  // 2. CREATE or UPDATE Request
  // -----------------------------------------------------------
  const handleModalSubmit = async (formData) => {
    setIsSubmitting(true);
    try {
      if (editingRequest) {
        // PUT update
        const res = await fetch(`${API_BASE}/${editingRequest._id}`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(formData)
        });
        const result = await res.json();
        if (!res.ok) {
          throw new Error(result.message || "Failed to update request.");
        }
        showToast("✓ Request updated successfully", "success");
      } else {
        // POST create
        const res = await fetch(API_BASE, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(formData)
        });
        const result = await res.json();
        if (!res.ok) {
          throw new Error(result.message || "Failed to submit request.");
        }
        showToast("✓ Request submitted successfully", "success");
      }

      setIsModalOpen(false);
      setEditingRequest(null);
      fetchRequests();
    } catch (err) {
      console.error("Form submit error:", err);
      showToast(err.message ? `! ${err.message}` : "! Something went wrong", "error");
    } finally {
      setIsSubmitting(false);
    }
  };

  // -----------------------------------------------------------
  // 3. DELETE Request
  // -----------------------------------------------------------
  const handleConfirmDelete = async () => {
    if (!deletingRequest) return;
    setIsDeleting(true);
    try {
      const res = await fetch(`${API_BASE}/${deletingRequest._id}`, {
        method: "DELETE"
      });
      const result = await res.json();
      if (!res.ok) {
        throw new Error(result.message || "Failed to delete request.");
      }
      showToast("✓ Request deleted successfully", "success");
      setDeletingRequest(null);
      fetchRequests();
    } catch (err) {
      console.error("Delete error:", err);
      showToast(err.message ? `! ${err.message}` : "! Something went wrong", "error");
    } finally {
      setIsDeleting(false);
    }
  };

  // Handlers for Opening Modals
  const handleOpenReport = () => {
    setEditingRequest(null);
    setIsModalOpen(true);
  };

  const handleEdit = (request) => {
    setEditingRequest(request);
    setIsModalOpen(true);
  };

  const handleDeletePrompt = (request) => {
    setDeletingRequest(request);
  };

  const handleViewDetails = (request) => {
    setViewingRequest(request);
  };

  // Filter requests
  const filteredRequests = requests.filter((req) => {
    if (priorityFilter !== "All" && req.priority !== priorityFilter) {
      return false;
    }
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      const matchName = req.studentName?.toLowerCase().includes(q);
      const matchEmail = req.email?.toLowerCase().includes(q);
      const matchCategory = req.category?.toLowerCase().includes(q);
      const matchDesc = req.description?.toLowerCase().includes(q);
      const matchId = req._id?.toString().slice(-4).toLowerCase().includes(q);
      return matchName || matchEmail || matchCategory || matchDesc || matchId;
    }
    return true;
  });

  return (
    <div className="app-layout">
      {/* Toast Alert */}
      <Toast toast={toast} onClose={() => setToast(null)} />

      {/* Top Navigation Bar */}
      <Navbar
        onOpenReport={handleOpenReport}
        requestsCount={requests.length}
      />

      <main className="main-content">
        {/* Hero Section */}
        <Hero onOpenReport={handleOpenReport} />

        {/* Simple 3-Box Statistics */}
        <Stats
          requests={requests}
          activeFilter={priorityFilter}
          onSelectFilter={setPriorityFilter}
        />

        {/* Requests Section */}
        <section id="requests-section" className="requests-section">
          {/* Section Header */}
          <div className="section-header">
            <div>
              <h2 className="section-title">Your Requests</h2>
              <p className="section-subtitle">
                View and manage submitted campus issues.
              </p>
            </div>

            {/* Total Badge */}
            <div className="section-count-badge">
              {filteredRequests.length} of {requests.length} Listed
            </div>
          </div>

          {/* Search & Filter Bar */}
          <div className="search-filter-bar">
            <div className="search-input-box">
              <span className="search-icon">🔍</span>
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search by student, category or description..."
                aria-label="Search requests"
              />
              {searchQuery && (
                <button
                  type="button"
                  className="search-clear-btn"
                  onClick={() => setSearchQuery("")}
                >
                  &times;
                </button>
              )}
            </div>

            <div className="filter-select-box">
              <select
                value={priorityFilter}
                onChange={(e) => setPriorityFilter(e.target.value)}
                aria-label="Filter by priority"
              >
                <option value="All">All Priorities ▼</option>
                <option value="High">High</option>
                <option value="Medium">Medium</option>
                <option value="Low">Low</option>
              </select>
            </div>
          </div>

          {/* Requests Content */}
          {loading ? (
            <div className="loading-state">
              <span className="loading-diamond">◇</span>
              <p>Loading campus requests...</p>
            </div>
          ) : filteredRequests.length === 0 ? (
            /* Empty State */
            <div className="empty-card">
              <div className="empty-symbol">◇</div>
              <h3 className="empty-title">No requests yet</h3>
              <p className="empty-text">
                {requests.length === 0
                  ? "You haven't submitted any campus issues."
                  : "No requests match your current search or filter."}
              </p>
              <button
                type="button"
                className="btn btn-gold"
                onClick={
                  requests.length === 0
                    ? handleOpenReport
                    : () => {
                        setSearchQuery("");
                        setPriorityFilter("All");
                      }
                }
              >
                {requests.length === 0 ? "+ Report a Problem" : "Clear Filters"}
              </button>
            </div>
          ) : (
            /* Request Cards Grid */
            <div className="requests-grid">
              {filteredRequests.map((req) => (
                <RequestCard
                  key={req._id}
                  request={req}
                  onEdit={handleEdit}
                  onDelete={handleDeletePrompt}
                  onViewDetails={handleViewDetails}
                />
              ))}
            </div>
          )}
        </section>
      </main>

      {/* Request Form Modal (Create / Edit) */}
      <RequestModal
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false);
          setEditingRequest(null);
        }}
        onSubmit={handleModalSubmit}
        editingRequest={editingRequest}
        isSubmitting={isSubmitting}
      />

      {/* Delete Confirmation Modal */}
      <DeleteModal
        isOpen={Boolean(deletingRequest)}
        onClose={() => setDeletingRequest(null)}
        onConfirm={handleConfirmDelete}
        targetRequest={deletingRequest}
        isDeleting={isDeleting}
      />

      {/* Details Modal */}
      <DetailsModal
        isOpen={Boolean(viewingRequest)}
        onClose={() => setViewingRequest(null)}
        request={viewingRequest}
        onEdit={(req) => {
          setViewingRequest(null);
          handleEdit(req);
        }}
      />

      {/* Footer */}
      <footer className="page-footer">
        <div className="footer-container">
          <div className="footer-brand">
            <span className="footer-diamond">◈</span>
            <span>CAMPUS HELP DESK &bull; 2026</span>
          </div>
          <div className="footer-note">
            Built with React, Express &amp; MongoDB
          </div>
        </div>
      </footer>
    </div>
  );
}

export default App;
