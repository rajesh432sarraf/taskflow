# TaskFlow — System Architecture

## 1. Architecture decision

Use a simple three-tier MERN architecture:

1. **Presentation:** React + Vite + Tailwind CSS
2. **Application/API:** Node.js + Express.js
3. **Data:** MongoDB Atlas + Mongoose

The browser communicates with the Express REST API over HTTPS. The backend validates requests, authenticates the user, applies ownership rules and reads/writes MongoDB.

## 2. High-level flow

```text
Browser
  |
  | React UI / Axios HTTPS requests
  v
Express REST API (Node.js)
  |
  | middleware: CORS, JSON parsing, authentication, validation
  v
Routes -> Controllers -> Mongoose Models
  |
  v
MongoDB Atlas
```

Response flow returns JSON from Express to React.

## 3. Suggested repository structure

```text
TaskFlow/
├── client/
│   ├── public/
│   ├── src/
│   │   ├── components/
│   │   ├── pages/
│   │   ├── context/
│   │   ├── hooks/
│   │   ├── services/
│   │   ├── utils/
│   │   ├── App.jsx
│   │   ├── main.jsx
│   │   └── index.css
│   ├── .env.example
│   └── package.json
├── server/
│   ├── config/
│   ├── models/
│   ├── controllers/
│   ├── routes/
│   ├── middleware/
│   ├── utils/
│   ├── server.js
│   ├── .env.example
│   └── package.json
├── docs/
├── .gitignore
└── README.md
```

Keep implementation proportional to the MVP. Do not add unnecessary layers or packages.

## 4. Frontend architecture

### Pages
- `/login`
- `/register`
- `/dashboard`
- `/tasks`
- `/tasks/new` (may be a modal instead)
- `/tasks/:id/edit` (may be a modal instead)

### Shared components
- `AppLayout`
- `Sidebar`
- `Topbar`
- `StatCard`
- `TaskList`
- `TaskCard`
- `TaskForm`
- `SearchInput`
- `TaskFilters`
- `ConfirmDialog`
- `ProtectedRoute`
- `LoadingState`
- `EmptyState`
- `ErrorMessage`

### State
- React Context for authentication state only.
- Local component state for forms, filters and task view state.
- Axios instance in `src/services/api.js`.
- Avoid Redux for this project.

## 5. Backend architecture

Request flow:

```text
HTTP Request
  -> Express app
  -> Route
  -> Authentication middleware (protected routes)
  -> Validation middleware
  -> Controller
  -> Mongoose model
  -> MongoDB
  -> JSON response
```

Responsibilities:
- **Routes:** map HTTP method/path to middleware and controller.
- **Controllers:** handle request/response and application logic.
- **Models:** define schema, constraints and indexes.
- **Middleware:** authentication, validation and error handling.
- **Config:** database connection and environment configuration.

## 6. Data model

### User document

```javascript
{
  _id: ObjectId,
  name: String,
  email: String,       // unique, lowercase, trimmed
  password: String,    // password hash only
  createdAt: Date,
  updatedAt: Date
}
```

### Task document

```javascript
{
  _id: ObjectId,
  userId: ObjectId,    // ref: User, required, indexed
  title: String,       // required, trimmed
  description: String,
  priority: "Low" | "Medium" | "High",
  status: "Pending" | "In Progress" | "Completed",
  dueDate: Date,       // optional
  createdAt: Date,
  updatedAt: Date
}
```

A user has many tasks. Every task belongs to exactly one user.

## 7. API contract

| Method | Path | Auth | Purpose |
|---|---|---:|---|
| POST | `/api/auth/register` | No | Create account |
| POST | `/api/auth/login` | No | Start session |
| POST | `/api/auth/logout` | Yes | End session |
| GET | `/api/auth/me` | Yes | Current user |
| POST | `/api/tasks` | Yes | Create task |
| GET | `/api/tasks` | Yes | List owned tasks |
| GET | `/api/tasks/:id` | Yes | Read owned task |
| PUT | `/api/tasks/:id` | Yes | Update owned task |
| DELETE | `/api/tasks/:id` | Yes | Delete owned task |
| GET | `/api/tasks/stats` | Yes | Owned task counts |
| GET | `/api/health` | No | Health check |

Use consistent JSON responses, for example:

```json
{
  "success": true,
  "message": "Task created successfully",
  "data": {}
}
```

Errors should have a consistent shape:

```json
{
  "success": false,
  "message": "A clear error message"
}
```

Use suitable status codes: 200, 201, 400, 401, 403 when appropriate, 404, 409 and 500.

## 8. Authentication decision and trade-offs

Preferred MVP approach: JWT in an **HTTP-only cookie**.

Advantages:
- JavaScript cannot directly read an HTTP-only cookie.
- Works naturally with browser requests when configured correctly.
- Logout can clear the cookie.

Costs and cautions:
- Cross-origin production deployment requires careful CORS and cookie configuration.
- Frontend requests must include credentials.
- For separate Vercel and Render origins, production cookies generally need `Secure` and `SameSite=None`; test browser third-party-cookie restrictions.
- Protect cookie-authenticated state-changing endpoints against CSRF. Use an appropriate CSRF strategy and validate Origin where suitable.
- Local development can use `SameSite=Lax` and `Secure=false` over localhost HTTP.

Do not silently switch to localStorage token storage. If the team chooses Bearer tokens instead, document the trade-off and avoid storing long-lived tokens in localStorage without understanding XSS risk.

> [!NOTE] Phase 0 Architecture Proposal (Cross-Origin Resilience)
> Because Vercel (`*.vercel.app`) and Render (`*.onrender.com`) operate on different public suffixes, modern browsers may block third-party cookies (Chrome 3P cookie restrictions, Safari ITP). As detailed in `docs/PHASE_0_REPORT.md`, the recommended solution is **Dual-Compatible JWT**: the backend issues both an HttpOnly cookie and returns the token in JSON; the client uses the `Authorization: Bearer <token>` header (persisted in memory / `sessionStorage`) alongside cookie credentials. This preserves cookie security while guaranteeing failure-proof authentication across separate hosting domains.

Password handling:
- Hash with bcryptjs (suitable cost factor).
- Never return password/hash in API responses.
- Never log credentials, tokens or connection strings.

## 9. Authorization and data isolation

For every task read/update/delete query, scope by both task ID and authenticated user ID:

```javascript
Task.findOne({
  _id: req.params.id,
  userId: req.user.id
});
```

For listing and dashboard statistics, always filter by authenticated user ID.

Never trust a `userId` sent by the browser. Derive it from the verified authenticated identity.

## 10. Deployment topology

- Frontend: Vercel
- Backend: Render
- Database: MongoDB Atlas

Configure:
- `VITE_API_URL` on Vercel
- `MONGO_URI`, `JWT_SECRET`, `CLIENT_URL`, `NODE_ENV` on Render
- Exact production frontend origin in CORS
- HTTPS and production cookie attributes
- Atlas network access suitable for the backend deployment
- `/api/health` health endpoint

A free backend service may sleep when inactive. The first request after inactivity can be delayed; this is a hosting limitation, not necessarily an application defect.

## 11. Architecture trade-offs

| Choice | Benefit | Cost / disadvantage | Decision |
|---|---|---|---|
| MERN monorepo | One repository, easy submission | Frontend/backend deploy separately | Use |
| REST API | Familiar and easy to test | More endpoint wiring than a full-stack framework | Use |
| MongoDB/Mongoose | Flexible documents, simple relationships | Must enforce validation and ownership carefully | Use |
| React Context | Minimal dependencies | Not ideal for complex global state | Use |
| Tailwind CSS | Fast consistent UI | Utility-heavy markup | Use |
| HTTP-only cookie | Better token confidentiality against JS access | CORS/CSRF/cookie setup complexity | Use with care |
| No Redux | Less setup | Local state can spread if poorly organized | Use for MVP |
| No microservices | Simple local development/deployment | Less independent scaling | Correct for this scope |

## 12. Error handling and observability

- Add a final 404 handler.
- Add centralized error middleware.
- Log concise server errors without secrets.
- Validate MongoDB ObjectIds before querying.
- Handle duplicate email errors cleanly.
- Handle invalid/expired authentication.
- Keep `/api/health` lightweight; optionally include database readiness without exposing connection details.
