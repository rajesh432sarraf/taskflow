# TaskFlow – Personal Task & Productivity Manager

A modern, full-stack MERN application for managing personal tasks, tracking deadlines, and boosting daily productivity.

---

## 🚀 Live Deployments

- **Frontend (Vercel):** [https://taskflow-three.vercel.app](https://taskflow-three.vercel.app) *(or your deployed Vercel domain)*
- **Backend API (Render):** [https://taskflow-server-wz2r.onrender.com](https://taskflow-server-wz2r.onrender.com)
- **API Health Check:** [https://taskflow-server-wz2r.onrender.com/api/health](https://taskflow-server-wz2r.onrender.com/api/health)

---

## ✨ Features

- **Authentication:**
  - Secure email/password login & registration with hashed passwords (bcrypt)
  - Seamless "Continue with Google" sign-in via Firebase OAuth
  - HTTP-only JWT cookies for secure, persistent sessions
- **Task Management (Full CRUD):**
  - Create, read, update, and delete tasks
  - Priority levels: *Low*, *Medium*, *High*
  - Status tracking: *Pending*, *In Progress*, *Completed*
  - Due date tracking with automatic overdue detection
- **Productivity Dashboard:**
  - Real-time statistics (Total, Pending, In Progress, Completed, Completion Rate)
  - Visual status breakdown & productivity progress bar
  - Search by task title/description and instant filter by status & priority
- **Responsive UI:**
  - Modern clean SaaS design with Tailwind CSS v4
  - Custom brand logo and high-contrast SVG/PNG favicons
  - Mobile-responsive sidebar drawer navigation

---

## 🛠️ Tech Stack

- **Frontend:** React 19, Vite, Tailwind CSS v4, Lucide React, Firebase Auth (Google OAuth)
- **Backend:** Node.js, Express 5, MongoDB Atlas, Mongoose, JWT, Cookie-Parser, CORS
- **Deployment:** Render (Backend web service), Vercel (Frontend SPA), MongoDB Atlas (Database)

---

## 💻 Local Development Setup

### 1. Prerequisites
- Node.js (v18 or higher)
- MongoDB Atlas database connection string

### 2. Backend Setup
```bash
cd server
npm install
# Create a .env file based on .env.example
npm run dev
```
Backend runs on `http://localhost:5000`.

### 3. Frontend Setup
```bash
cd client
npm install
# Create a .env file with VITE_API_URL and VITE_FIREBASE_* keys
npm run dev
```
Frontend runs on `http://localhost:5173`.

---

## 🧪 Testing

To run the automated backend unit, integration, and E2E test suite (26/26 tests):
```bash
npm run test:all --prefix server
```

---

## 📄 License
MIT License.
