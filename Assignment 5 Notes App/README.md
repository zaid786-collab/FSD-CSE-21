# College Notes PDF Portal 📄 (React + Express)

A simple, basic, and clean academic notes web application built with **React** and **Express**. Users can search for particular subject notes and download them directly as **PDF documents**.

---

## 🚀 Features

- **📄 Notes in PDF Format**: All notes are formatted and downloaded as genuine `.pdf` documents with headers, syllabus topics, and academic references.
- **🔍 Search Particular Notes**: Instant search by title, subject, unit, or topic keywords (e.g., *'flexbox'*, *'normalization'*, *'binary tree'*).
- **📥 Download PDF**: 1-click download button that generates and saves the PDF file.
- **👁️ View PDF**: Opens the PDF document directly in the browser viewer in a new tab.
- **🏷️ Subject Filter**: Quick filter buttons for *Web Development*, *DBMS*, *Data Structures*, *Operating Systems*, etc.
- **➕ Add PDF Notes**: Simple form to enter document title, subject, topics, and content to create new PDF notes.
- **🎨 Simple & Clean UI**: Minimalist, clean styling designed specifically for college web development assignments.

---

## 📁 Project Structure

```
├── client/                 # React Frontend (Vite)
│   ├── src/
│   │   ├── App.jsx         # Simple PDF notes search & download logic
│   │   └── index.css       # Clean, basic styles
│   └── package.json
├── server/                 # Express Backend
│   ├── server.js           # REST API & PDFKit document generator
│   ├── data/
│   │   └── notes.json      # College syllabus notes database
│   └── package.json
├── index.html              # Standalone simple HTML version
├── style.css               # Standalone CSS
└── app.js                  # Standalone JS
```

---

## 💻 How to Run

### Run Both React & Express:
From the project root:
```bash
npm run dev
```

- **React App**: `http://localhost:3000` (or `http://localhost:3001`)
- **Express Backend**: `http://localhost:5000`

### Or Run Standalone:
Double click [`index.html`](file:///d:/CODING/COLLEGE/3RD%20SEM/Web%20Devlopement/Assignment%205%20Notes%20App/index.html) to open directly in any browser.
