# Mohammad Zaid Khan — Personal Developer Portfolio & CMS

Production-ready, full-stack personal portfolio and content management system for **Mohammad Zaid Khan** (Software Engineer | Full-Stack Developer | Competitive Programmer). Built with a modern decoupled architecture: React 19 SPA frontend, Node.js/Express REST API backend, MongoDB persistence, and an administrative control portal.

---

## 🏛️ System Architecture

```
Portfolio/
├── client/                     # React 19, Vite, Tailwind CSS v4, Framer Motion
│   ├── public/
│   │   ├── Mohammad_Zaid_Khan_Resume.pdf  # Verified ATS-friendly 1-page PDF resume
│   │   └── favicon.svg         # Technical MZK monogram mark
│   ├── src/
│   │   ├── components/         # Modular layout, home sections, icons
│   │   ├── pages/              # Home, ProjectDetail (/projects/:slug), Admin (/mzk-control)
│   │   ├── index.css           # Tailwind design tokens, typography, dark mode
│   │   └── main.jsx
│   └── vite.config.js          # Vite config with API proxy for local development
│
├── server/                     # Node.js, Express, MongoDB (Mongoose), Security
│   ├── controllers/            # Public & Admin API controllers
│   ├── middleware/             # Auth guard (single-admin email lock), rate limit, honeypot
│   ├── models/                 # Profile, Project, Skill, Experience, Education, AdminUser, etc.
│   ├── routes/                 # Public (/api/*) and Admin (/api/admin/*) routes
│   ├── services/               # Email service (Nodemailer/abstracted), stats cache
│   ├── seeds/                  # Idempotent database seeder with verified datasets
│   ├── scripts/                # ATS resume PDF generator
│   ├── tests/                  # Automated test suite (node:test)
│   └── server.js               # Express application entrypoint
│
├── netlify.toml                # Netlify deployment configuration & security headers
├── render.yaml                 # Render backend service deployment configuration
└── .env.example                # Environment variable documentation template
```

---

## 🚀 Quickstart & Local Setup

### 1. Prerequisites
- **Node.js**: v18.0.0 or later (v20+ recommended)
- **npm**: v9.0.0 or later
- **MongoDB**: Local instance running on port 27017 or a MongoDB Atlas URI

### 2. Clone & Install Dependencies

```bash
# Install root, client, and server dependencies
cd d:/CODING/Portfolio
npm --prefix client install
npm --prefix server install
```

### 3. Environment Configuration

Copy `.env.example` to `server/.env`:

```bash
cp .env.example server/.env
```

Default variables in `server/.env`:
```env
PORT=5000
NODE_ENV=development
CORS_ORIGIN=http://localhost:5173
MONGODB_URI=mongodb://127.0.0.1:27017/portfolio
JWT_SECRET=mzk_super_secret_jwt_key_here_minimum_32_characters
ADMIN_INITIAL_PASSWORD=SetAStrongPassword2026!
NOTIFICATION_EMAIL=zaidkhan24082006@gmail.com
```

### 4. Database Seeding (Idempotent)

Seed verified personal info, 5 featured projects, skills, and credentials into MongoDB:

```bash
npm run seed
```

### 5. Running the Application

#### Option A: Run Full Stack Concurrently (Recommended)
```bash
npm run dev
# Concurrently runs Express API on http://localhost:5000 and Vite Client on http://localhost:5173
```

#### Option B: Run in Separate Terminals
In terminal 1 (Backend API):
```bash
npm run server
# Runs Express on http://localhost:5000 with --watch
```

In terminal 2 (Frontend Client):
```bash
npm run client
# Runs Vite on http://localhost:5173
```

---

## 🧪 Testing & Production Build

### Run Automated API Tests
Executes the native test suite covering health checks, portfolio endpoints, contact form validation, honeypot traps, and admin authorization:

```bash
npm run test
```

### Build Frontend for Production
Compiles the optimized React client bundle:

```bash
npm run build
```

---

## 🔒 Security & Admin System (`/mzk-control`)

- **Single-Admin Access Lock**: Admin access is strictly enforced server-side exclusively for `zaidkhan24082006@gmail.com`. Any attempt by another identity is rejected with `401 Unauthorized`.
- **HTTP-Only Cookies**: JWT tokens are issued with `httpOnly`, `sameSite: strict`, and path-scoped security.
- **Spam Defense**: Contact form includes an invisible honeypot trap, IP rate limiting (max 5 requests / 15 min), and input sanitization.
- **Safe Content Deletion**: Defaults to soft-delete (archiving) with explicit confirmation required for permanent database removal.

---

## 🌐 Deployment Configuration

### Frontend (Netlify)
1. Link your repository to Netlify.
2. The `netlify.toml` file automatically sets:
   - **Base directory**: `client`
   - **Build command**: `npm run build`
   - **Publish directory**: `dist`
   - **SPA Redirects**: `/* /index.html 200`
3. Set environment variable:
   - `VITE_API_URL`: Your deployed Render API URL (e.g. `https://mzk-portfolio-api.onrender.com`)

### Backend (Render)
1. Create a **Web Service** on Render pointing to the repository root.
2. Render uses `render.yaml` automatically, or configure manually:
   - **Root directory**: `server`
   - **Build command**: `npm install`
   - **Start command**: `npm start`
3. Set environment variables on Render:
   - `NODE_ENV`: `production`
   - `MONGODB_URI`: Your MongoDB Atlas connection string
   - `CORS_ORIGIN`: Your Netlify frontend domain (e.g. `https://mohammadzaidkhan.netlify.app`)
   - `JWT_SECRET`: A long random string
   - `ADMIN_INITIAL_PASSWORD`: Your admin password
   - `NOTIFICATION_EMAIL`: `zaidkhan24082006@gmail.com`
