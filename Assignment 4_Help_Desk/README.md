# Campus Help Desk — Premium Dark & Golden Edition (MERN Stack)

A modern, university-grade web application where students can submit, view, track, edit, and manage campus problems or service requests with persistent storage in MongoDB.

---

## 🎨 Design Philosophy: Dark & Golden Aesthetic

* **Base Canvas:** Deep Charcoal / Obsidian Black (`#0D0D0D`, `#151515`, `#1B1B1B`)
* **Accents:** Warm Gold (`#D4AF37`, `#E6C65C`) for primary buttons, logos, active states, and subtle focus lines
* **Typography:** Clean off-white text (`#F5F5F5`, `#A5A5A5`) using `Inter` and `Poppins`
* **Layout:** Centered 1200px max-width layout with sticky top navigation, clean hero section, and 3-box statistics

---

## 📁 Project Structure

```text
campus-help-desk/
│
├── backend/
│   ├── server.js              # Express app & MongoDB Mongoose connection
│   ├── package.json           # express, mongoose, cors, dotenv, nodemon
│   ├── .env                   # PORT=5000 & MONGO_URI
│   ├── .gitignore             # Ignores node_modules and .env
│   │
│   ├── models/
│   │   └── Request.js         # Mongoose schema with validation & timestamps
│   │
│   └── routes/
│       └── requestRoutes.js   # All 5 REST API routes (GET, POST, PUT, DELETE)
│
└── frontend/
    ├── package.json           # React 18, React DOM, Vite
    ├── index.html             # HTML entry point with Inter & Poppins typography
    ├── vite.config.js         # Vite dev configuration (Port 5173)
    │
    └── src/
        ├── main.jsx           # React DOM root render
        ├── App.jsx            # State management, native fetch(), and modal triggers
        ├── App.css            # Dark & Golden design system with CSS variables
        └── components/
            ├── Navbar.jsx         # Sticky header with ◈ CAMPUS HELP DESK logo
            ├── Hero.jsx           # Clean hero section with gold CTA and diamond accent
            ├── Stats.jsx          # 3 minimalist metric cards with gold underline
            ├── RequestCard.jsx    # Clean dark card with #REQ-XXXX, priority, and actions
            ├── RequestModal.jsx   # Create & Edit form modal with validation
            ├── DeleteModal.jsx    # Custom confirmation modal for deletion
            ├── DetailsModal.jsx   # Full request details view modal
            └── Toast.jsx          # Subtle feedback notifications
```

---

## 🚀 How to Run the Application

### 1. Start the Backend API

```bash
cd backend
npm install
npm run dev
```
* Backend runs on: **`http://localhost:5000`**

### 2. Start the React Frontend

```bash
cd frontend
npm install
npm run dev
```
* Frontend runs on: **`http://localhost:5173`**

---

## 🌐 REST API Endpoints

| Method | Endpoint | Description | Request Body |
|---|---|---|---|
| `GET` | `/api/requests` | Fetch all requests from MongoDB (newest first) | None |
| `GET` | `/api/requests/:id` | Fetch a single request by MongoDB `_id` | None |
| `POST` | `/api/requests` | Create and store a new request in MongoDB | `{ studentName, email, category, priority, description }` |
| `PUT` | `/api/requests/:id` | Update an existing request in MongoDB | `{ studentName, email, category, priority, description }` |
| `DELETE` | `/api/requests/:id` | Delete a request document from MongoDB | None |

---

## ✨ Features

1. **Sticky Top Navigation:** Gold `◈ CAMPUS HELP DESK` brand with live request counter pill and `+ Report Problem` button.
2. **Hero Section:** Clean title with gold highlight, subtitle, and subtle geometric diamond divider.
3. **3-Box Minimalist Statistics:** `TOTAL REQUESTS`, `HIGH PRIORITY`, and `YOUR REQUESTS` with thin gold accent lines.
4. **Instant Search & Filter:** Filter by priority (*All, High, Medium, Low*) or search by student name, email, category, description, or ticket ID in real-time.
5. **Clean Dark Request Cards:**
   * `#REQ-XXXX` visual ID derived from MongoDB `_id`
   * Subtle priority indicator (`● HIGH`, `● MEDIUM`, `● LOW`)
   * Card click opens full **Details Modal**
   * Smooth hover lift and gold border transition
6. **Custom Modals (No browser `alert()` or `confirm()`):**
   * **Report / Edit Modal:** Clean inputs with gold focus rings and validation
   * **Delete Modal:** Elegant confirmation before purging ticket from MongoDB
   * **Details Modal:** Complete breakdown with formatted submission date
   * **Toast Notification:** Subtle feedback alerts for created, updated, and deleted requests.
