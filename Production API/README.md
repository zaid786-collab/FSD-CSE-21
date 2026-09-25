# Production REST API & Product Management Dashboard

A full-stack production-grade REST API and interactive management dashboard built with **Express.js (Node.js)** and **React 19 (Vite)**.

---

## 🚀 Features

- **Production REST API**:
  - Full CRUD operations on products (`GET`, `POST`, `PUT`, `DELETE`).
  - Search filtering by keyword across name, category, and description.
  - Category filtering (`Computing`, `Audio`, `Accessories`, `Wearables`).
  - Multi-criteria sorting (Price Low/High, Rating, Alphabetical).
  - Live inventory statistics & analytics (`/api/stats`).
  - User profile endpoint (`/api/user`).
  - Health check & uptime monitoring (`/api/health`).
  - Safe persistent file-based storage (`backend/data/products.json`).
  - Reset utility (`/api/products/reset`) to restore initial demo catalog anytime.
  - Clean error handling, validation, and request logging middleware.

- **Modern Glassmorphic Frontend**:
  - Real-time statistics cards: Total Products, Inventory Evaluation, Average Price, Low Stock Alerts.
  - Interactive Modal for creating and editing products.
  - Instant search bar and category filter pills.
  - Dynamic Toast notification system for user feedback.
  - User Profile widget in navigation header.

---

## 📁 Project Structure

```
Production API/
├── backend/
│   ├── data/
│   │   ├── products.json      # Persistent product storage
│   │   └── user.json          # User profile data
│   ├── package.json           # Express, CORS, ES module setup
│   └── server.js              # Production REST API server
├── frontend/
│   ├── src/
│   │   ├── App.jsx            # Main Dashboard & UserProfile component
│   │   ├── App.css            # Modern responsive styling
│   │   ├── index.css          # Design system variables & base styles
│   │   └── main.jsx           # Entrypoint
│   ├── vite.config.js         # Vite proxy configuration for /api
│   └── package.json
├── package.json               # Root convenience runner
└── README.md
```

---

## 🛠️ API Reference

### Health Check
- **`GET /api/health`**
  - Response: `{ status: "healthy", service: "Production API", uptime: 12.4, timestamp: "..." }`

### Products
- **`GET /api/products`**
  - Query parameters:
    - `search`: Filter by keyword (`?search=macbook`)
    - `category`: Filter by category (`?category=Computing`)
    - `sortBy`: `price`, `rating`, `name`, `stock`
    - `order`: `asc` or `desc`
- **`GET /api/products/:id`**
  - Fetches single product by ID.
- **`POST /api/products`**
  - Creates a new product.
  - Body: `{ name: string, price: number, category: string, stock?: number, description?: string, rating?: number }`
- **`PUT /api/products/:id`**
  - Updates an existing product by ID.
- **`DELETE /api/products/:id`**
  - Deletes a product by ID.
- **`POST /api/products/reset`**
  - Restores default demo catalog.

### Analytics & Stats
- **`GET /api/stats`**
  - Returns `totalProducts`, `totalStock`, `totalInventoryValue`, `averagePrice`, `categoriesCount`, `lowStockCount`.

### User Profile
- **`GET /api/user`**
  - Returns user profile data.
- **`PUT /api/user`**
  - Updates user profile.

---

## 💻 Running the Application

### 1. Run the Backend API (Port 5000)
```bash
cd backend
npm start
# or with auto-reload:
npm run dev
```

### 2. Run the Frontend Dashboard (Port 5173)
```bash
cd frontend
npm run dev
```

### 3. Run from Root Workspace
```bash
# Start backend:
npm run dev:backend

# Start frontend:
npm run dev:frontend
```
