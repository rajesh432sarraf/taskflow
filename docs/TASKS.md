# TaskFlow — Implementation Tasks and Milestones

## Status legend
- `[ ]` Not started
- `[x]` Complete and verified
- `[~]` In progress
- `[!]` Blocked

Do not mark tasks complete until verified in the actual workspace.

## Phase 0 — Product and workspace readiness

- [x] Read all documents in `docs/`.
- [x] Inspect current workspace and existing files.
- [x] Confirm Node.js and npm versions.
- [x] Confirm Git is installed and configured.
- [x] Confirm project root and repository strategy.
- [!] Confirm MongoDB Atlas account/deployment availability (Awaiting user URI).
- [x] Review MVP scope and explicitly defer non-goals.
- [x] Review authentication and cross-origin cookie trade-offs.
- [!] Record actual team member names and registration numbers when provided (Awaiting user input).
- [x] Produce a phase-by-phase execution plan with risks and acceptance checks (See `docs/PHASE_0_REPORT.md`).
- [x] Obtain user/team approval before destructive changes or major architecture changes (Approved by user on 2026-11-05).

**Phase 0 exit criteria:** Completed and approved.

## Phase 1 — Foundation and local setup

- [x] Create/verify root repository (Git initialized at `D:\TASKFLOW`).
- [x] Create React + Vite app in `client/`.
- [x] Install frontend dependencies (`axios`, `react-router-dom`, `lucide-react`, `tailwindcss`).
- [x] Configure Tailwind CSS (Tailwind 4 + `@tailwindcss/vite` with `DESIGN.md` tokens).
- [x] Create Express app in `server/`.
- [x] Install backend dependencies (`express`, `mongoose`, `cors`, `dotenv`, `cookie-parser`, `jsonwebtoken`, `bcryptjs`).
- [x] Create config/models/controllers/routes/middleware structure.
- [x] Add root and client `.gitignore`.
- [x] Add frontend and backend `.env.example`.
- [x] Configure local environment variables without committing secrets.
- [!] Connect MongoDB Atlas (Mongoose connection configured in `config/db.js`; awaiting user URI in `.env`).
- [x] Implement `/api/health` with database status and uptime reporting.
- [x] Verify frontend builds and runs (`vite build` succeeded in 1.10s).
- [x] Verify backend starts locally (Express listening on port 5000, `/api/health` 200 OK).
- [x] Verify frontend-to-backend communication (Axios with `withCredentials: true` tested).
- [x] Commit foundation to Git.

**Exit criteria:** React page builds, API health endpoint responds with HTTP 200, database connection helper handles missing URI gracefully, zero secrets or `node_modules` committed. (Phase 1 complete and fully verified on 2026-11-05: 7/7 operational checks PASS; MongoDB Atlas connection pending user URI).

## Phase 2 — Backend

- [ ] Create User model.
- [ ] Create Task model.
- [ ] Add registration with validation and password hashing.
- [ ] Add login.
- [ ] Add logout.
- [ ] Add current-user endpoint.
- [ ] Implement authentication middleware.
- [ ] Implement task create.
- [ ] Implement task list with search and filters.
- [ ] Implement task detail.
- [ ] Implement task update.
- [ ] Implement task delete.
- [ ] Implement dashboard statistics.
- [ ] Add centralized error handling and 404 handler.
- [ ] Test ownership isolation with two separate users.
- [ ] Document API examples.

**Exit criteria:** All required APIs work and cross-user access is prevented.

## Phase 3 — Frontend

- [ ] Configure React Router.
- [ ] Create global design tokens and layout.
- [ ] Build login page.
- [ ] Build registration page.
- [ ] Build authentication context and protected routes.
- [ ] Build dashboard and statistics cards.
- [ ] Build task list.
- [ ] Build task card.
- [ ] Build create/edit task form.
- [ ] Add search.
- [ ] Add status and priority filters.
- [ ] Add delete confirmation.
- [ ] Add loading, empty, success and error states.
- [ ] Add responsive behavior.
- [ ] Verify refresh/session behavior.

**Exit criteria:** User can complete all core flows through the UI.

## Phase 4 — Integration and quality

- [ ] Connect every UI flow to the real API.
- [ ] Remove temporary/mock data.
- [ ] Verify all CRUD operations.
- [ ] Verify search/filter combinations.
- [ ] Verify dashboard counts.
- [ ] Verify user isolation.
- [ ] Check browser console and server logs.
- [ ] Check responsive layouts.
- [ ] Fix critical accessibility and validation issues.
- [ ] Run a complete manual acceptance test.

**Exit criteria:** No critical defects in the MVP acceptance flow.

## Phase 5 — Deployment

- [ ] Create/verify MongoDB Atlas production configuration.
- [ ] Deploy backend to Render.
- [ ] Configure production environment variables.
- [ ] Configure CORS and cookie/CSRF settings.
- [ ] Verify backend health endpoint.
- [ ] Deploy frontend to Vercel.
- [ ] Configure `VITE_API_URL`.
- [ ] Verify login, session persistence and logout in production.
- [ ] Verify CRUD, search, filters and statistics in production.
- [ ] Verify cross-user data isolation in production.
- [ ] Record actual deployment URLs.

**Exit criteria:** Public deployed application works end-to-end.

## Phase 6 — Submission

- [ ] Complete README.
- [ ] Add actual project screenshots.
- [ ] Add architecture diagram.
- [ ] Prepare 7–10 slide presentation.
- [ ] Upload presentation to same GitHub repository.
- [ ] Add team name and three actual member names.
- [ ] Add three registration numbers.
- [ ] Add GitHub URL and deployed URL to shared spreadsheet.
- [ ] Verify repository and public deployment links are accessible.
- [ ] Final submission review.

## Suggested 3-person responsibility split

- Member 1: React pages, components, responsive styling.
- Member 2: Express routes, controllers, auth and API behavior.
- Member 3: MongoDB schemas, integration support, testing and deployment.

All members should review the API contract and understand the complete product. Avoid isolated work that cannot be integrated.

## Risk register

| Risk | Impact | Mitigation |
|---|---|---|
| Critical deadline (Nov 6, 2026 - Tomorrow) | High / Failure | Strictly freeze MVP scope, defer all non-goals, execute rapid clean Phase 1-6 plan |
| MongoDB connection/config issue | Blocks backend | Verify URI, credentials, IP access (0.0.0.0/0) early |
| Cookie/CORS mismatch in production | Login/session fails | Dual-compatible auth (Bearer header + HttpOnly cookie fallback) |
| Scope creep | Miss deadline | Defer all non-MVP features |
| Merge conflicts | Lost time | Small branches and frequent pulls |
| Weak authorization | Data exposure | Test with two separate accounts |
| Free hosting cold start | Slow first request | Explain hosting behavior and add frontend warming indicator |
| Incomplete documentation | Submission penalty | Reserve final phase for README/PPT |
