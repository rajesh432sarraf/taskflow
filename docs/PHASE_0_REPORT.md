# TaskFlow — Phase 0 Discovery, Audit & Architecture Report

**Project:** TaskFlow – Personal Task & Productivity Manager  
**Team:** Golden Eagles  
**Target Stack:** MongoDB, Express.js, React.js (Vite), Node.js, Tailwind CSS  
**Target Hosting:** Vercel (Frontend), Render (Backend), MongoDB Atlas (Database)  
**Report Date:** 2026-11-05  
**Auditor:** Antigravity Full-Stack Architect / Tech Lead  

---

## 1. Executive Summary

Phase 0 discovery and architectural validation for **TaskFlow** is complete. The workspace has been thoroughly inspected in a safe, read-only manner. The project currently exists as a well-specified documentation baseline under `docs/`. No application code, package manifests, or Git metadata currently exist in the repository root.

**Critical Milestone Finding:**  
The submission deadline specified in the project notice is **Friday, 6 November 2026**. As of the audit timestamp (Thursday, 5 November 2026), the remaining runway is approximately **24–30 hours**. This short timeline demands:
1. Strict adherence to an uncompromising MVP scope.
2. Immediate exclusion of all non-essential abstractions (no Redux, no TypeScript migrations, no microservices, no AI plugins, no websockets).
3. Early resolution of the cross-origin authentication topology between Vercel and Render.
4. Clean, modular code that the three student team members can confidently explain in an academic viva.

The workspace is clean, uncorrupted, and structurally ready for Phase 1 initialization upon user approval.

---

## 2. Workspace Audit (Verified Facts Only)

All findings below were directly verified via read-only shell inspection on the host machine:

| Inspection Item | Verified State | Notes / Impact |
|---|---|---|
| **Working Directory** | `D:\TASKFLOW` | Absolute root confirmed. No nested `TaskFlow/TaskFlow` folders. |
| **Existing Files / Folders** | `docs/` folder only | Contains 8 documentation files (`PRD.md`, `ARCHITECTURE.md`, `DESIGN.md`, `MEMORY.md`, `RULES.md`, `TASKS.md`, `README.md`, `PHASE_0_PROMPT.md`). |
| **Workspace Emptiness** | Partially populated | Contains documentation only; zero lines of application code. |
| **Git Repository** | Not initialized | `fatal: not a git repository`. No `.git/` folder and no remotes exist. |
| **Node.js Runtime** | `v24.16.0` | Compatible modern Node.js environment. |
| **Package Manager (npm)** | `11.11.0` | Compatible npm package manager. |
| **`client/` Directory** | Missing | To be created in Phase 1 via Vite. |
| **`server/` Directory** | Missing | To be created in Phase 1. |
| **Dependencies** | None installed | No `package.json`, `package-lock.json`, or `node_modules` in root or subdirectories. |
| **`.gitignore`** | Missing | Must be created in Phase 1 before running `git add` to prevent committing secrets or `node_modules`. |
| **Environment Files (`.env`)** | None present | No secrets detected, leaked, or committed. |
| **Code to Preserve** | None | Only documentation files in `docs/` must be preserved. |

---

## 3. Requirements and MVP Scope

### 3.1 Course & Submission Alignment Check

| Requirement Item | Status | Details / Actions Needed |
|---|---|---|
| **Team Size** | 3 members required | Placeholder roles drafted; actual student names & registration numbers are pending user input. |
| **Project Title & Team Name** | Confirmed | Title: *TaskFlow – Personal Task & Productivity Manager*; Team: *Golden Eagles*. |
| **MERN Architecture** | Confirmed | MongoDB Atlas + Express.js + React.js (Vite) + Node.js. |
| **Full CRUD Operations** | Confirmed | Create, Read, Update, Delete for personal tasks. |
| **Deliverables Required** | Confirmed | 1. GitHub source repository<br>2. Live deployed application<br>3. 7–10 slide PowerPoint presentation uploaded to the repo<br>4. Shared spreadsheet submission entry |
| **Deadline** | **CRITICAL RISK** | **Friday, 6 November 2026** (Tomorrow). Zero margin for delays or secondary features. |

### 3.2 Frozen MVP Scope

The core MVP is strictly limited to the following:
- **Authentication:**
  - Register with `name`, `email`, `password`.
  - Login with email and password.
  - Logout.
  - Session verification (`GET /api/auth/me`).
  - Strict password hashing with `bcryptjs`.
- **Task Management (CRUD):**
  - Create task (`title` [required], `description` [optional], `priority` [Low, Medium, High - default Medium], `status` [Pending, In Progress, Completed - default Pending], `dueDate` [optional]).
  - View list of owned tasks.
  - View individual owned task.
  - Update owned task (status, priority, details).
  - Delete owned task with UI confirmation.
- **Search, Filter & Dashboard:**
  - Case-insensitive search on task titles.
  - Filter by status (`Pending`, `In Progress`, `Completed`).
  - Filter by priority (`Low`, `Medium`, `High`).
  - Combined search and filters.
  - Dashboard counts: Total, Pending, In Progress, Completed tasks (user-scoped).
- **User Interface:**
  - Clean light theme (`#F7F8FA` background, `#202938` typography, `#27845B` emerald accent).
  - Responsive layout (desktop sidebar, mobile header navigation).
  - Distinct empty, loading, and error states.

### 3.3 Explicitly Deferred Features (Non-MVP)

The following features are **frozen out** and will not be implemented for this release:
- Team collaboration or shared/assigned tasks
- Real-time chat or WebSockets
- Calendar synchronization (Google/Outlook)
- Email or push notifications
- File or image attachments
- AI-driven task scheduling or decomposition
- Recurring task automation
- Dark mode theme toggling
- User profile avatars / file uploads
- Payment or billing tiers
- Administrative dashboards

---

## 4. Architecture Review and Trade-offs

| Decision Area | Option Selected | Benefits | Disadvantages & Costs | Technical Risks | Recommendation for MVP |
|---|---|---|---|---|---|
| **1. Repository Structure** | MERN Monorepo (`client/`, `server/`, `docs/`) | Single GitHub URL for submission; single place to commit documentation and PPT slides. | Frontend and backend build configurations exist in separate subdirectories. | Misconfigured root scripts or accidental top-level `node_modules` pollution. | **Approve Monorepo.** Use isolated `client/` and `server/` subfolders with a root `.gitignore`. |
| **2. API Architecture** | Express REST API under `/api` | Standardized, intuitive, zero learning curve for viva presentation; easily testable with curl/Postman. | Requires manual endpoint definition and DTO-like validation. | Inconsistent JSON response shapes if middleware is neglected. | **Approve REST.** Adopt standard `{ success, message, data }` response contracts. |
| **3. Database & Modeling** | MongoDB Atlas + Mongoose | Native JSON document model matches task schema; fast queries on indexed fields (`userId`). | No automatic relational foreign key constraints at database level. | Accidental cross-user data leakage if `userId` is omitted from queries. | **Approve Mongoose.** Explicitly enforce `{ _id: taskId, userId: req.user.id }` on every operation. |
| **4. State Management** | React Context (Auth only) + `useState` | Zero external state libraries (no Redux overhead); simple to trace and explain in an academic viva. | Not suitable for massive cross-component state synchronization. | Prop-drilling if component tree becomes deeply nested. | **Approve Context.** Use Context strictly for `user` and `authStatus`; keep task lists and filters in page-level state. |
| **5. Styling Strategy** | Tailwind CSS | Rapid styling adhering to design tokens; eliminates custom CSS clashes; responsive utilities out of the box. | CSS utility class density inside JSX. | Risk of inconsistent ad-hoc styling if tokens aren't respected. | **Approve Tailwind.** Define primary colors in `tailwind.config.js`. |
| **6. Auth Token Transport** | HTTP-Only Cookie vs. Bearer Header | High theoretical protection against XSS token harvesting when configured on same-origin. | High friction across separate deployment domains (Vercel vs. Render). | Third-party cookie blocking in modern browsers breaks production auth (details in Section 5). | **Evaluate carefully (Section 5).** Default to Bearer Header or robust dual support to prevent deployment failure. |
| **7. Hosting Topology** | Vercel (Client) + Render (Server) + Atlas (DB) | High-availability free tiers; automatic deployments from Git branches. | Render free instances spin down after 15 min of inactivity (50s cold start). | Reviewers might perceive a cold start as a crashed backend. | **Approve Topology.** Add a clear "Warming up server..." visual banner if initial health ping takes > 3s. |
| **8. Search & Analytics** | Mongoose regex + Aggregation pipeline | Fast, self-contained, no external search services (Elasticsearch/Algolia) required. | Regex can cause ReDoS if special characters are unescaped. | Unindexed queries could degrade if datasets grow large. | **Approve.** Sanitize regex inputs; index `{ userId: 1, status: 1 }` and `{ userId: 1, priority: 1 }`. |

---

## 5. Authentication and Security Decision

### 5.1 Cross-Origin Cookie Challenge on Vercel + Render

`ARCHITECTURE.md` proposes an HTTP-only cookie containing the JWT. While this is an industry best practice for same-domain architectures (e.g. `app.example.com` and `api.example.com`), it presents severe pitfalls in free-tier student deployments:

1. **Different Public Suffixes (Third-Party Context):**
   - Frontend is hosted on `taskflow-*.vercel.app`.
   - Backend is hosted on `taskflow-*.onrender.com`.
   - Because `vercel.app` and `onrender.com` are on the Public Suffix List, browsers treat cookies set by Render as **third-party cross-site cookies**.
2. **Aggressive Browser Cookie Restrictions:**
   - Safari (Intelligent Tracking Prevention), Chrome (Privacy Sandbox / 3P cookie phaseout / incognito restrictions), and Firefox (Enhanced Tracking Protection) block cross-site cookies by default.
   - When a student or evaluator tests the app in Safari, an iOS browser, or Chrome Incognito, the login response will succeed with `Set-Cookie`, but the browser will **silently refuse to persist or return the cookie** in subsequent Axios requests. The user is bounced back to `/login` immediately.
3. **Complex Cookie Attributes Required:**
   - For cross-site cookies to function at all, the server must set:
     ```javascript
     res.cookie('token', token, {
       httpOnly: true,
       secure: true,        // Required for SameSite=None
       sameSite: 'none',    // Required for cross-origin
       partitioned: true    // Modern CHIPS support
     });
     ```
   - In local development over HTTP (`localhost`), `SameSite=None` with `Secure=true` is rejected by browsers unless local HTTPS certificates are configured. Thus, dual environment-dependent cookie logic is mandatory.

### 5.2 Architectural Recommendation: Resilient Authentication

To ensure that Golden Eagles' submission **never fails during viva evaluation**, we recommend the following approach:

- **Primary Recommended Strategy: Dual-Compatible JWT (Bearer Header with Local/Session Fallback):**
  - The backend accepts the JWT from either an `Authorization: Bearer <token>` header **or** an `HttpOnly` cookie.
  - On login/register, the backend returns the token in both:
    1. The JSON response body (`{ success: true, token, user }`).
    2. An HTTP-only cookie (`SameSite=None`, `Secure=true` in production; `SameSite=Lax`, `Secure=false` in dev).
  - The React frontend stores the active token in memory (React AuthContext) and synchronizes it to `sessionStorage` (cleared when the browser tab closes, mitigating long-term XSS persistence).
  - Axios automatically attaches `Authorization: Bearer ${token}` and sets `withCredentials: true`.
  - **Why this is superior for this project:**
    - Zero risk of evaluator rejection due to third-party cookie blocking.
    - Zero divergence between local development and production.
    - Full viva-defensibility: the team can explain both HTTP-only cookies and Bearer tokens to the examiner.

### 5.3 Security Hardening Checklist

1. **Password Security:** Use `bcryptjs` with salt factor 10. Passwords must never be logged or returned in responses (`select: '-password'`).
2. **CORS Configuration:** Explicitly bind allowed origins (no wildcard `*` with credentials):
   ```javascript
   cors({
     origin: process.env.CLIENT_URL || 'http://localhost:5173',
     credentials: true
   })
   ```
3. **Data Scoping:** Enforce tenant isolation on every single database operation:
   ```javascript
   // Mandatory pattern:
   Task.findOne({ _id: req.params.id, userId: req.user.id });
   ```
4. **Input Sanitization:** Escape special regex characters in the search query to prevent ReDoS attacks.

---

## 6. Data Model and API Contract Review

### 6.1 Mongoose Schemas

#### User Schema (`server/models/User.js`)
```javascript
{
  name: { type: String, required: true, trim: true, minlength: 2, maxlength: 50 },
  email: { type: String, required: true, unique: true, lowercase: true, trim: true },
  password: { type: String, required: true, minlength: 6, select: false },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
}
```

#### Task Schema (`server/models/Task.js`)
```javascript
{
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true, index: true },
  title: { type: String, required: true, trim: true, maxlength: 120 },
  description: { type: String, trim: true, maxlength: 1000, default: '' },
  priority: { type: String, enum: ['Low', 'Medium', 'High'], default: 'Medium', index: true },
  status: { type: String, enum: ['Pending', 'In Progress', 'Completed'], default: 'Pending', index: true },
  dueDate: { type: Date, default: null },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
}
```
*Compound Indexes:*
- `{ userId: 1, status: 1 }`
- `{ userId: 1, priority: 1 }`
- `{ userId: 1, createdAt: -1 }`

### 6.2 REST Endpoints

| Method | Route | Access | Request Body / Query Params | Success Response (200 / 201) |
|---|---|---|---|---|
| `GET` | `/api/health` | Public | None | `{ success: true, message: "TaskFlow API healthy", database: "connected" }` |
| `POST` | `/api/auth/register` | Public | `{ name, email, password }` | `{ success: true, message: "User registered", token, user: { id, name, email } }` |
| `POST` | `/api/auth/login` | Public | `{ email, password }` | `{ success: true, message: "Login successful", token, user: { id, name, email } }` |
| `POST` | `/api/auth/logout` | Auth | None | `{ success: true, message: "Logged out" }` |
| `GET` | `/api/auth/me` | Auth | None | `{ success: true, user: { id, name, email } }` |
| `GET` | `/api/tasks/stats` | Auth | None | `{ success: true, data: { total: 12, pending: 5, inProgress: 4, completed: 3 } }` |
| `GET` | `/api/tasks` | Auth | `?search=term&status=Pending&priority=High` | `{ success: true, count: 3, data: [ ...tasks ] }` |
| `POST` | `/api/tasks` | Auth | `{ title, description?, priority?, status?, dueDate? }` | `{ success: true, message: "Task created", data: { task } }` |
| `GET` | `/api/tasks/:id` | Auth | None | `{ success: true, data: { task } }` |
| `PUT` | `/api/tasks/:id` | Auth | `{ title?, description?, priority?, status?, dueDate? }` | `{ success: true, message: "Task updated", data: { task } }` |
| `DELETE` | `/api/tasks/:id` | Auth | None | `{ success: true, message: "Task deleted", data: { id } }` |

> [!IMPORTANT]
> In Express routing, `/api/tasks/stats` **must** be mounted *before* `/api/tasks/:id` to prevent Express from parsing the literal string `"stats"` as a MongoDB ObjectId.

---

## 7. Risk Register

| Risk ID | Risk Description | Likelihood | Impact | Mitigation Strategy |
|---|---|---|---|---|
| **RSK-01** | **Submission Deadline (Tomorrow, Nov 6)** | High | Severe | Freeze MVP scope completely. Defer all non-essential features. Do not refactor once working. |
| **RSK-02** | **Cross-Origin Cookie Failure (Vercel vs Render)** | High | High | Dual-compatible auth token (support Bearer Authorization header alongside HTTP-only cookies). |
| **RSK-03** | **Render Free-Tier Cold Starts (> 50s)** | High | Medium | Add clear visual status banner on frontend ("Connecting to server, please allow up to 60s on first load"). |
| **RSK-04** | **MongoDB Atlas IP Access Block** | Medium | High | Whitelist `0.0.0.0/0` (Allow access from anywhere) in Atlas Network Access settings for Render deployment. |
| **RSK-05** | **Tenant Data Isolation Leak** | Low | Severe | Mandate `{ _id: taskId, userId: req.user.id }` in all Mongoose updates, deletes, and single-item reads. |
| **RSK-06** | **Git Merge Conflicts Between Team Members** | Medium | Medium | Assign clear vertical domains (Member 1: UI, Member 2: API/Auth, Member 3: Data/Deploy). |
| **RSK-07** | **Incomplete Viva Documentation / PPT** | Medium | High | Dedicated Phase 6 milestone to prepare 7–10 slide deck and README with architecture diagrams. |
| **RSK-08** | **Node.js Compatibility Differences** | Low | Low | Lock Node engine specification in `package.json` (`>=18.0.0 <=24.x`). |

---

## 8. Phase 1 Step-by-Step Plan

Phase 1 establishes the complete foundation, verifying local execution and database connectivity before writing business logic:

1. **Repository Setup:**
   - Initialize Git in `D:\TASKFLOW`.
   - Create root `.gitignore` (ignoring `.env`, `node_modules`, `dist`, `.DS_Store`, npm debug logs).
2. **Client Initialization:**
   - Scaffold React + Vite app in `client/` using template `react`.
   - Install client dependencies: `axios`, `react-router-dom`, `lucide-react`, `tailwindcss`, `@tailwindcss/vite` (or standard PostCSS Tailwind v3/v4).
   - Configure Tailwind with TaskFlow color tokens (`#F7F8FA`, `#27845B`, `#202938`, `#E5E7EB`).
   - Create `client/.env.example` (`VITE_API_URL=http://localhost:5000/api`).
3. **Server Initialization:**
   - Create `server/` directory and initialize `package.json`.
   - Install production dependencies: `express`, `mongoose`, `dotenv`, `cors`, `cookie-parser`, `jsonwebtoken`, `bcryptjs`.
   - Install dev dependencies: `nodemon`.
   - Establish server directory structure:
     `server/config/`, `server/models/`, `server/controllers/`, `server/routes/`, `server/middleware/`, `server/utils/`.
   - Create `server/.env.example` (`PORT`, `MONGO_URI`, `JWT_SECRET`, `CLIENT_URL`, `NODE_ENV`).
4. **Core Infrastructure Wiring:**
   - Implement `server/config/db.js` with Mongoose connection logic and error trapping.
   - Implement `server/server.js` with CORS, JSON parser, cookie parser, and `/api/health` endpoint.
5. **Connectivity & Smoke Verification:**
   - Start backend, test `GET http://localhost:5000/api/health`.
   - Verify MongoDB Atlas connection logs `MongoDB Connected`.
   - Start frontend, verify default Vite page renders at `http://localhost:5173`.
6. **Git Baseline Commit:**
   - Create initial commit: `feat: initialize MERN foundation, client, server and configuration`.

---

## 9. Commands to Run (OS-Specific)

### 9.1 Windows (PowerShell) — Current Environment

```powershell
# 1. Initialize Git in project root
cd D:\TASKFLOW
git init

# 2. Scaffold Client (React + Vite)
npm create vite@latest client -- --template react
cd client
npm install
npm install axios react-router-dom lucide-react
npm install -D tailwindcss @tailwindcss/vite
cd ..

# 3. Scaffold Server
New-Item -ItemType Directory -Path server -Force
cd server
npm init -y
npm install express mongoose dotenv cors cookie-parser jsonwebtoken bcryptjs
npm install -D nodemon
New-Item -ItemType Directory -Path config, models, controllers, routes, middleware, utils -Force
cd ..
```

### 9.2 macOS / Linux (Bash) — Team Member Reference

```bash
# 1. Initialize Git in project root
cd /path/to/TASKFLOW
git init

# 2. Scaffold Client (React + Vite)
npm create vite@latest client -- --template react
cd client
npm install
npm install axios react-router-dom lucide-react
npm install -D tailwindcss @tailwindcss/vite
cd ..

# 3. Scaffold Server
mkdir -p server/{config,models,controllers,routes,middleware,utils}
cd server
npm init -y
npm install express mongoose dotenv cors cookie-parser jsonwebtoken bcryptjs
npm install -D nodemon
cd ..
```

---

## 10. Verification and Acceptance Criteria

Phase 1 will be considered complete and verified only when:
1. `git status` displays a clean status with no untracked `.env` or `node_modules`.
2. Running `npm run dev` in `client/` opens the TaskFlow UI on `http://localhost:5173` without Vite or Tailwind errors.
3. Running `npm run dev` in `server/` starts Express on port `5000`.
4. `curl http://localhost:5000/api/health` returns HTTP 200 with:
   ```json
   {
     "success": true,
     "message": "TaskFlow API healthy",
     "database": "connected"
   }
   ```
5. MongoDB Atlas logs a successful connection without IP whitelist errors.
6. Zero secrets or sensitive connection strings exist in git staging or commit history.

---

## 11. Open Questions / Required User Inputs

Before or during Phase 1 execution, the team must provide:
1. **MongoDB Atlas URI:** The connection string for the database cluster. (Required in Phase 1 to verify database connectivity).
2. **Team Member Information:** Real names and registration numbers for the three students to populate the presentation slides, README, and submission spreadsheet.
3. **GitHub Remote URL:** The remote repository URL to configure after local Git initialization.
4. **Authentication Choice Confirmation:** Confirm adoption of the dual-compatible auth strategy (Bearer header + cookie fallback) to protect against Vercel/Render third-party cookie blockage.

---

## 12. Phase 0 Exit Decision

### **Decision: READY (with Blockers noted for Phase 1 inputs)**

- **Architecture:** Validated and sound.
- **Scope:** Cleanly frozen to MVP requirements.
- **Workspace:** Clean, audited, and ready.
- **Safety:** Zero code overwritten, zero secrets exposed.

**STOP CONDITION:**  
In accordance with instructions, work stops here. No Phase 1 files or code changes will be made until explicit user authorization is provided.

**User command required to proceed:**  
> **"Approve Phase 0 and start Phase 1."**

