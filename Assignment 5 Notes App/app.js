// Simple & Basic Notes App Logic

const DEFAULT_NOTES = [
  {
    id: "note-1",
    title: "CSS Grid vs Flexbox: The Ultimate Layout Guide",
    category: "Web Development",
    createdAt: "2026-10-01",
    downloads: 12,
    content: "When to use Flexbox:\n- One-dimensional layouts (row or column).\n- Good for navigation bars, buttons, and centering elements.\n\nWhen to use CSS Grid:\n- Two-dimensional layouts (rows and columns).\n- Ideal for page layouts, galleries, and dashboards."
  },
  {
    id: "note-2",
    title: "JavaScript Promises & Async/Await Guide",
    category: "Web Development",
    createdAt: "2026-10-02",
    downloads: 25,
    content: "Async / Await Pattern:\n- async functions always return a Promise.\n- await pauses execution until the Promise resolves or rejects.\n\nExample:\nasync function loadData() {\n  const res = await fetch('/api/notes');\n  const data = await res.json();\n  return data;\n}"
  },
  {
    id: "note-3",
    title: "Database Normalization (1NF, 2NF, 3NF)",
    category: "DBMS",
    createdAt: "2026-09-28",
    downloads: 30,
    content: "1NF: Eliminate duplicate columns and ensure atomic values.\n2NF: Meet 1NF and remove partial dependencies.\n3NF: Meet 2NF and remove transitive dependencies (non-key attributes depending on non-key attributes)."
  },
  {
    id: "note-4",
    title: "Binary Search Tree (BST) Operations",
    category: "Data Structures",
    createdAt: "2026-09-25",
    downloads: 18,
    content: "In-Order Traversal: Left -> Root -> Right (produces sorted order).\nPre-Order Traversal: Root -> Left -> Right (used for cloning trees).\nPost-Order Traversal: Left -> Right -> Root (used for deleting trees).\n\nAverage Time Complexity: O(log n) for search, insert, and delete."
  },
  {
    id: "note-5",
    title: "CPU Scheduling Algorithms: FCFS, SJF, Round Robin",
    category: "Operating Systems",
    createdAt: "2026-09-20",
    downloads: 15,
    content: "FCFS: First-Come, First-Served (Simple FIFO, prone to convoy effect).\nSJF: Shortest Job First (Minimum average waiting time).\nRound Robin: Time-sharing with time quantum (TQ) for fair CPU allocation."
  }
];

let notes = [];
let selectedCategory = "All";
let searchQuery = "";

// Load from LocalStorage
function loadNotes() {
  const saved = localStorage.getItem("simple_notes");
  if (saved) {
    try {
      notes = JSON.parse(saved);
    } catch (e) {
      notes = [...DEFAULT_NOTES];
    }
  } else {
    notes = [...DEFAULT_NOTES];
    saveNotes();
  }
}

function saveNotes() {
  localStorage.setItem("simple_notes", JSON.stringify(notes));
}

// Download single note
function downloadNote(noteId, format = "txt") {
  const note = notes.find(n => n.id === noteId);
  if (!note) return;

  note.downloads = (note.downloads || 0) + 1;
  saveNotes();

  const safeTitle = note.title.replace(/[^a-zA-Z0-9_-]/g, "_");
  const filename = `${safeTitle}.${format}`;
  
  const text = `Title: ${note.title}\nCategory: ${note.category}\nDate: ${note.createdAt}\n\n${note.content}`;

  const blob = new Blob([text], { type: "text/plain;charset=utf-8" });
  const link = document.createElement("a");
  link.href = URL.createObjectURL(blob);
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(link.href);

  render();
}

// Export all notes
function exportAllNotes() {
  let content = "=== ALL NOTES BACKUP ===\n\n";
  notes.forEach((n, idx) => {
    content += `[${idx + 1}] ${n.title} (${n.category})\n${n.content}\n\n--------------------\n\n`;
  });

  const blob = new Blob([content], { type: "text/plain;charset=utf-8" });
  const link = document.createElement("a");
  link.href = URL.createObjectURL(blob);
  link.download = "All_Notes_Backup.txt";
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}

// Delete note
function deleteNote(noteId) {
  const note = notes.find(n => n.id === noteId);
  if (!note) return;
  if (!confirm(`Delete note: "${note.title}"?`)) return;

  notes = notes.filter(n => n.id !== noteId);
  saveNotes();
  render();
}

// Render categories
function renderCategories() {
  const container = document.getElementById("categoryChips");
  const cats = ["All", ...new Set(notes.map(n => n.category))];

  container.innerHTML = cats.map(cat => `
    <button class="cat-btn ${selectedCategory === cat ? 'active' : ''}" data-cat="${cat}">
      ${cat}
    </button>
  `).join("");

  container.querySelectorAll(".cat-btn").forEach(btn => {
    btn.addEventListener("click", () => {
      selectedCategory = btn.dataset.cat;
      render();
    });
  });
}

// Render notes list
function render() {
  renderCategories();

  const filtered = notes.filter(note => {
    const matchesCat = selectedCategory === "All" || note.category.toLowerCase() === selectedCategory.toLowerCase();
    const q = searchQuery.toLowerCase().trim();
    const matchesSearch = !q || 
      note.title.toLowerCase().includes(q) || 
      note.content.toLowerCase().includes(q) || 
      note.category.toLowerCase().includes(q);

    return matchesCat && matchesSearch;
  });

  const countEl = document.getElementById("resultsCount");
  countEl.innerHTML = `Found <strong>${filtered.length}</strong> note${filtered.length !== 1 ? 's' : ''}`;

  const grid = document.getElementById("notesGrid");
  const emptyState = document.getElementById("emptyState");

  if (filtered.length === 0) {
    grid.innerHTML = "";
    emptyState.style.display = "block";
    return;
  }

  emptyState.style.display = "none";
  grid.innerHTML = filtered.map(note => `
    <div class="note-card">
      <div class="note-card-header">
        <div class="note-title">${note.title}</div>
        <span class="note-badge">${note.category}</span>
      </div>
      <div class="note-date">Date: ${note.createdAt}</div>
      <div class="note-content">${note.content}</div>
      <div class="note-actions">
        <span class="download-count">Downloads: ${note.downloads || 0}</span>
        <div class="action-buttons">
          <button class="btn btn-primary btn-sm" onclick="downloadNote('${note.id}', 'txt')">
            Download .txt
          </button>
          <button class="btn btn-secondary btn-sm" onclick="downloadNote('${note.id}', 'md')">
            Download .md
          </button>
          <button class="btn btn-danger btn-sm" onclick="deleteNote('${note.id}')">
            Delete
          </button>
        </div>
      </div>
    </div>
  `).join("");
}

// Setup Event Listeners
document.addEventListener("DOMContentLoaded", () => {
  loadNotes();

  const searchInput = document.getElementById("searchInput");
  const clearBtn = document.getElementById("clearSearchBtn");
  const modal = document.getElementById("noteModal");
  const openModalBtn = document.getElementById("openAddModalBtn");
  const closeModalBtn = document.getElementById("closeNoteModalBtn");
  const emptyAddBtn = document.getElementById("emptyAddBtn");
  const noteForm = document.getElementById("noteForm");
  const exportBtn = document.getElementById("exportAllBtn");

  searchInput.addEventListener("input", (e) => {
    searchQuery = e.target.value;
    clearBtn.style.display = searchQuery ? "inline-block" : "none";
    render();
  });

  clearBtn.addEventListener("click", () => {
    searchInput.value = "";
    searchQuery = "";
    clearBtn.style.display = "none";
    render();
  });

  exportBtn.addEventListener("click", exportAllNotes);

  openModalBtn.addEventListener("click", () => {
    modal.style.display = "flex";
  });
  emptyAddBtn.addEventListener("click", () => {
    modal.style.display = "flex";
  });
  closeModalBtn.addEventListener("click", () => {
    modal.style.display = "none";
  });

  noteForm.addEventListener("submit", (e) => {
    e.preventDefault();
    const title = document.getElementById("noteTitleInput").value.trim();
    const category = document.getElementById("noteCategoryInput").value.trim() || "General";
    const content = document.getElementById("noteContentInput").value.trim();

    if (!title || !content) return;

    const newNote = {
      id: "note-" + Date.now(),
      title,
      category,
      createdAt: new Date().toISOString().slice(0, 10),
      downloads: 0,
      content
    };

    notes.unshift(newNote);
    saveNotes();
    noteForm.reset();
    modal.style.display = "none";
    render();
  });

  render();
});
