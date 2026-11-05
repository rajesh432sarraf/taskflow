# Product Requirements Document (PRD)

## 1. Product identity

- **Name:** TaskFlow
- **Full title:** TaskFlow – Personal Task & Productivity Manager
- **Team:** Golden Eagles
- **Product type:** Responsive web application
- **Primary users:** Students and individuals managing personal work
- **Primary outcome:** Help a signed-in user keep track of what needs to be done, its priority, deadline and completion state.

## 2. Problem statement

People often track their work across notebooks, messages and unrelated apps. This fragments task information and makes it harder to identify priorities, upcoming deadlines and completed work.

## 3. Proposed solution

TaskFlow provides one simple workspace to create and manage tasks, organize them by status and priority, search and filter them, and view a small productivity summary.

## 4. Product goals

1. Provide a straightforward registration and login experience.
2. Let each user create, read, update and delete their own tasks.
3. Make status, priority and due date easy to understand.
4. Provide useful search and filters.
5. Display accurate task counts on a dashboard.
6. Work on desktop and mobile browsers.
7. Deploy the frontend, backend and database successfully.

## 5. Non-goals for the first release

Do not build these in the MVP:
- Team collaboration or shared tasks
- Real-time chat
- Calendar synchronization
- Push/email notifications
- File attachments
- AI task generation
- Recurring tasks
- Complex analytics or gamification
- Payment/subscription features
- Admin panel

These can be considered only after the MVP is stable and the training deadline allows it.

## 6. User stories

### Authentication
- As a visitor, I can register using my name, email and password.
- As a registered user, I can log in and log out.
- As a signed-in user, I can access protected pages.
- As a user, I cannot view another user's tasks.

### Task management
- As a user, I can create a task with a title.
- As a user, I can optionally add a description and due date.
- As a user, I can choose Low, Medium or High priority.
- As a user, I can set Pending, In Progress or Completed status.
- As a user, I can see my tasks.
- As a user, I can edit a task.
- As a user, I can delete a task after confirmation.

### Discovery and overview
- As a user, I can search tasks by title.
- As a user, I can filter by status and priority.
- As a user, I can see total, pending, in-progress and completed counts.

## 7. Functional requirements

| ID | Requirement | Priority |
|---|---|---|
| FR-01 | Register with name, email and password | Must |
| FR-02 | Log in and log out | Must |
| FR-03 | Protect authenticated routes and APIs | Must |
| FR-04 | Create a task | Must |
| FR-05 | List only the signed-in user's tasks | Must |
| FR-06 | Read a single owned task | Should |
| FR-07 | Update an owned task | Must |
| FR-08 | Delete an owned task | Must |
| FR-09 | Search task titles | Must |
| FR-10 | Filter by status and priority | Must |
| FR-11 | Show dashboard task counts | Must |
| FR-12 | Responsive layout | Must |
| FR-13 | Show useful loading, empty and error states | Must |
| FR-14 | Profile editing | Could / defer |
| FR-15 | Dark mode | Could / defer |

## 8. Data requirements

### User
- `name`: required string, trimmed
- `email`: required, normalized to lowercase, unique
- `password`: required input; store only a secure hash
- timestamps

### Task
- `userId`: required reference to User
- `title`: required, trimmed, reasonable maximum length
- `description`: optional, reasonable maximum length
- `priority`: enum `Low | Medium | High`, default `Medium`
- `status`: enum `Pending | In Progress | Completed`, default `Pending`
- `dueDate`: optional valid date
- timestamps

Use Mongoose schemas and indexes where useful. Never accept `userId` from the client as proof of ownership; derive it from the authenticated session/token.

## 9. API requirements

Base path: `/api`

### Auth
- `POST /auth/register`
- `POST /auth/login`
- `POST /auth/logout`
- `GET /auth/me`

### Tasks
- `POST /tasks`
- `GET /tasks`
- `GET /tasks/:id`
- `PUT /tasks/:id`
- `DELETE /tasks/:id`

### Dashboard
- `GET /tasks/stats`

### Query parameters for `GET /tasks`
- `search`: case-insensitive title search
- `status`: one valid status
- `priority`: one valid priority

Combine filters safely. Invalid filter values should return a clear 400 response. Pagination is optional; if implemented, validate page and limit and set a sensible maximum.

## 10. Non-functional requirements

- **Security:** hash passwords; validate inputs; enforce task ownership; protect secrets.
- **Reliability:** consistent JSON errors and correct HTTP status codes.
- **Usability:** clear labels, accessible contrast, keyboard-friendly controls.
- **Performance:** avoid unnecessary database queries; add indexes for common lookups.
- **Maintainability:** separate routes, controllers, models and middleware.
- **Compatibility:** current Chrome/Edge and responsive mobile browsers.
- **Deployment:** production environment variables and CORS/cookie configuration must be explicit.

## 11. Acceptance criteria

The MVP is accepted only when:

1. A new user can register and log in.
2. Passwords are never stored in plain text.
3. An unauthenticated user cannot call protected task endpoints.
4. User A cannot read, edit or delete User B's tasks, even by guessing an ID.
5. A user can create, view, update and delete their own tasks.
6. Search and filters return correct results.
7. Dashboard counts match the user's actual tasks.
8. Refreshing the browser preserves the intended authentication session.
9. Loading, empty and error states are handled.
10. Frontend, backend and MongoDB work together in the deployed app.

## 12. MVP success measure

A reviewer can register, log in, create multiple tasks, change status and priority, search/filter, edit and delete tasks, and see accurate dashboard counts without accessing another user's data.
