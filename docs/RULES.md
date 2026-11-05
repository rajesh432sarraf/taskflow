# TaskFlow — Engineering Rules and Definition of Done

## 1. General engineering principles

1. Build the smallest complete solution that meets the PRD.
2. Prefer readable, maintainable code over clever code.
3. Do not add dependencies without a clear reason.
4. Keep frontend and backend responsibilities separate.
5. Do not duplicate business logic across components.
6. Do not hardcode secrets, deployment URLs or personal data.
7. Do not use fake data as if it came from the database.
8. Do not leave dead buttons, placeholder links or unfinished flows in the submitted MVP.

## 2. JavaScript and React rules

- Use functional React components and hooks.
- Use clear component and variable names.
- Keep components focused.
- Put API calls in a service layer where practical.
- Use React Context only for shared authentication state.
- Use local state for page-specific UI state.
- Use stable keys when rendering lists.
- Avoid unnecessary `useEffect`; derive values when possible.
- Handle loading, empty and error states.
- Do not expose secrets through `VITE_` environment variables. Vite variables are public in the browser bundle.

## 3. Backend rules

- Use Express routers, controllers, models and middleware.
- Validate all client input on the server.
- Use Mongoose schema validation and appropriate indexes.
- Use async error handling and a centralized error handler.
- Return consistent JSON response shapes.
- Use appropriate HTTP status codes.
- Validate MongoDB ObjectIds before database lookups.
- Never trust client-supplied ownership fields.
- Do not return password hashes or secrets.
- Avoid logging tokens, passwords, cookies or connection strings.

## 4. Security rules

- Passwords must be hashed using bcryptjs.
- Enforce unique normalized email addresses.
- Use a strong random JWT secret supplied through environment variables.
- Protect all task endpoints.
- Every task query must be scoped to the authenticated user's ID.
- Configure CORS with explicit allowed origins, not an unrestricted wildcard when credentials are used.
- If using cookies, set `HttpOnly`; use `Secure` in production; configure `SameSite` deliberately; use credentials in browser requests; add CSRF protection for state-changing requests.
- Use HTTPS in production.
- Keep `.env` files out of Git.
- Use `.env.example` with placeholder values only.
- Never commit real MongoDB credentials or JWT secrets.

## 5. API rules

- Base path: `/api`.
- Use plural resource path `/tasks`.
- Use POST to create, GET to read, PUT to update and DELETE to remove.
- Use query parameters for search and filtering.
- Return a clear message on errors.
- Do not expose internal stack traces to production clients.
- Ensure dashboard statistics are computed only for the current user.

## 6. Git and collaboration rules

- `main` should contain working, reviewed code.
- Use short-lived branches such as `feature/auth`, `feature/task-crud`, `feature/dashboard`.
- Use descriptive commits, e.g. `feat: add task creation endpoint`.
- Pull before starting shared work.
- Do not commit `node_modules`, `.env`, build output or editor cache.
- Resolve merge conflicts deliberately; do not overwrite teammates' work.
- All three team members should make meaningful contributions and understand the whole app.

## 7. Testing rules

At minimum test:
- Successful registration and login.
- Duplicate email and invalid credentials.
- Unauthenticated API access.
- Create/read/update/delete own tasks.
- Attempt to access another user's task.
- Search and combined filters.
- Correct dashboard counts.
- Invalid IDs and invalid enum values.
- Empty and error states in UI.
- Refresh/session persistence.
- Mobile layout.
- Production frontend-to-backend connectivity.

## 8. Definition of done for a task

A task is done only when:
1. Implementation matches the requirement.
2. Validation and error handling are included.
3. Security and ownership implications are checked.
4. Relevant tests or manual verification are completed.
5. No obvious console/server errors remain.
6. Documentation/status is updated where necessary.
7. The result is committed with a clear message.

## 9. Definition of done for MVP

Use the acceptance criteria in `PRD.md`. A screenshot of a page alone does not prove a feature works. The deployed application must be tested end-to-end.
