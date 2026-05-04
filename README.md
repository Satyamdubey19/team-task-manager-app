# Team Task Manager

Full-stack web app with role-based access control (Admin/Member).

## Tech Stack

| Layer      | Technology                               |
| ---------- | ---------------------------------------- |
| Backend    | Node.js, Express.js, MongoDB (Mongoose)  |
| Frontend   | React 18, Vite, TailwindCSS, React Query |
| Auth       | JWT (Bearer token)                       |
| Validation | express-validator                        |
| Security   | Helmet, mongo-sanitize, rate-limiting    |

## Project Structure

```
Assessment/
├── backend/
│   ├── server.js
│   └── src/
│       ├── app.js
│       ├── config/         # DB connection
│       ├── controllers/    # Route handlers (thin layer)
│       ├── services/       # Business logic
│       ├── models/         # Mongoose schemas
│       ├── routes/         # Express routers
│       ├── middleware/     # Auth, RBAC, validation, errors
│       ├── validators/     # express-validator rules
│       └── utils/          # JWT, logger, AppError, response
└── frontend/
    └── src/
        ├── api/            # Axios instances + API calls
        ├── components/     # Reusable UI components
        ├── context/        # AuthContext
        ├── pages/          # Route-level pages
        └── routes/         # AppRouter + ProtectedRoute
```

## Getting Started

### Prerequisites

- Node.js >= 18
- MongoDB running locally (or provide Atlas URI)

### Backend

```bash
cd backend
cp .env.example .env      # edit MONGO_URI and JWT_SECRET
npm run dev               # starts on http://localhost:5000
```

### Frontend

```bash
cd frontend
npm run dev               # starts on http://localhost:5173
```

## API Endpoints

### Auth

| Method | Endpoint           | Description      |
| ------ | ------------------ | ---------------- |
| POST   | /api/auth/register | Create account   |
| POST   | /api/auth/login    | Login            |
| GET    | /api/auth/me       | Get current user |

### Projects

| Method | Endpoint                          | Description     |
| ------ | --------------------------------- | --------------- |
| GET    | /api/projects                     | List projects   |
| POST   | /api/projects                     | Create project  |
| GET    | /api/projects/:id                 | Get project     |
| PUT    | /api/projects/:id                 | Update project  |
| DELETE | /api/projects/:id                 | Delete project  |
| POST   | /api/projects/:id/members         | Add member      |
| DELETE | /api/projects/:id/members/:userId | Remove member   |
| GET    | /api/projects/dashboard/stats     | Dashboard stats |

### Tasks

| Method | Endpoint                      | Description       |
| ------ | ----------------------------- | ----------------- |
| GET    | /api/tasks/project/:projectId | Tasks by project  |
| POST   | /api/tasks                    | Create task       |
| GET    | /api/tasks/:id                | Get task          |
| PUT    | /api/tasks/:id                | Update task       |
| DELETE | /api/tasks/:id                | Delete task       |
| GET    | /api/tasks/my                 | My assigned tasks |
| GET    | /api/tasks/overdue            | Overdue tasks     |

## Role-Based Access

| Action              | Admin | Project Admin    | Member   |
| ------------------- | ----- | ---------------- | -------- |
| Manage all projects | ✅    | ✅ (own)         | ❌       |
| Add/remove members  | ✅    | ✅ (own project) | ❌       |
| Create/update tasks | ✅    | ✅               | ✅       |
| Delete tasks        | ✅    | ✅               | Own only |
| Delete users        | ✅    | ❌               | ❌       |
