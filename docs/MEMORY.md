# TaskFlow — Project Memory and Working Context

This file is the source of truth for AI-assisted development sessions. Read it before making changes.

## 1. Project identity

- Product: TaskFlow – Personal Task & Productivity Manager
- Team: Golden Eagles
- Stack: MongoDB, Express.js, React.js, Node.js
- Frontend tooling: Vite
- Styling: Tailwind CSS
- IDE: Antigravity IDE
- Repository approach: single Git repository with `client/`, `server/` and `docs/`
- Intended hosting: Vercel frontend, Render backend, MongoDB Atlas database
- Scope: beginner-friendly MERN training MVP, targeted for 1–2 days of focused development

## 2. Product purpose

A single user can securely manage personal tasks: create, view, edit, delete, search, filter and track task status, priority and due date.

## 3. Confirmed product decisions

- Use professional light theme.
- Background `#F7F8FA`, white cards, charcoal text, green accent `#27845B`.
- Task statuses: `Pending`, `In Progress`, `Completed`.
- Priorities: `Low`, `Medium`, `High`.
- User and Task are the only required MongoDB collections for MVP.
- Each task belongs to one user via `userId`.
- Use React Context for authentication; do not introduce Redux.
- Use Axios for API calls.
- Use REST endpoints under `/api`.
- Keep code readable and explainable by a student team.
- Do not add optional features until core acceptance criteria pass.

## 4. Team roles (proposed; confirm actual member names)

- Member 1: React UI and frontend integration
- Member 2: Express APIs and authentication
- Member 3: MongoDB models, testing and deployment support

All members should understand the complete workflow and contribute to the repository.

## 5. Security decisions

- Hash passwords with bcryptjs.
- Never store plain-text passwords.
- Never expose password hashes in API responses.
- Keep `.env` out of Git.
- Derive user identity from verified authentication, never from request body.
- Scope all task operations to the authenticated user's ID.
- Preferred auth transport: HTTP-only cookie, with correct CORS, credentials, SameSite, Secure and CSRF protections.
- If deployment constraints require a different token strategy, explain the risk and ask before changing the documented decision.

## 6. Development phases

- Phase 0: inspect workspace, validate requirements, record decisions, plan risks and setup sequence.
- Phase 1: initialize repository, frontend, backend, Tailwind and MongoDB connection.
- Phase 2: backend models, auth, task CRUD, search/filter and stats.
- Phase 3: frontend pages, routing, auth context and task UI.
- Phase 4: integration, responsive polish and end-to-end testing.
- Phase 5: deployment and production verification.
- Phase 6: README, screenshots, presentation and submission checklist.

## 7. Working agreement for AI tools

At the start of each session:
1. Read this file and relevant architecture/design/rules/tasks documents.
2. Inspect the actual repository before editing.
3. Identify the current phase and existing completed work.
4. Do not recreate or overwrite working files unnecessarily.
5. Make small, coherent changes.
6. Run relevant checks and report exact results.
7. Update `TASKS.md` and this file when a decision or project status changes.
8. Do not claim tests passed unless actually run.

## 8. Current status

- Phase 0: Completed and approved.
- Phase 1: Completed, hardened, and verified with live MongoDB Atlas connection on 2026-11-05.
- Phase 2: Completed and 100% verified against live MongoDB Atlas cluster on 2026-11-05.
  - Workspace: `D:\TASKFLOW`
  - Models: `server/models/User.js` (email lowercase, bcrypt hook, password hidden), `server/models/Task.js` (title max 100, description max 1000, priority & status enums, dueDate, user ref, compound indexes).
  - Auth: `POST /api/auth/register`, `POST /api/auth/login`, `POST /api/auth/logout`, `GET /api/auth/me`. HTTP-only secure cookie transport with Bearer token header fallback.
  - Task CRUD: `POST /api/tasks`, `GET /api/tasks` (with search and status/priority filters), `GET /api/tasks/:id`, `PUT /api/tasks/:id`, `DELETE /api/tasks/:id`.
  - Statistics: `GET /api/tasks/stats` providing `totalTasks`, `pendingTasks`, `inProgressTasks`, `completedTasks`, and dynamically calculated `overdueTasks`.
  - Security & Isolation: Strict user scoping (`user: req.user._id`) on all queries. Cross-user read, update, and delete all return 404 (zero information leakage). Express-validator rules on all payloads.
  - Centralized Error Handling: Custom 404 handler and error handler mapping CastError, duplicate keys (11000), validation errors, and JWT expiration.
  - Live Testing: 15/15 automated integration tests passed against live MongoDB Atlas cluster with complete test data cleanup.
  - Next milestone: Phase 3 (Frontend Authentication, Pages, Context, Task UI & Forms).

## 9. Open decisions and required user inputs

- Actual names and registration numbers of the three members of team Golden Eagles.
- Final GitHub repository remote URL.
- Actual deployment URLs on Vercel and Render (once provisioned).

Do not invent these values. Ask the team when they become necessary.
