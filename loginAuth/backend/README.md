# CSC426: Login Authentication App

A full-stack login and registration system built with HTML, CSS, JavaScript (frontend) and Node.js, Express, bcrypt, and JWT (backend).

---

## Project structure

```
week1-login/
├── frontend/
│   ├── index.html     # UI — login and register forms
│   ├── style.css      # Styles — responsive, dark theme
│   └── script.js      # Validation, API calls, session management
└── backend/
    ├── server.js       # Express app entry point
    ├── db.js           # JSON file-based user storage
    ├── validators.js   # Server-side input validation
    ├── routes/
    │   └── auth.js     # /register, /login, /me routes
    ├── package.json
    ├── .env.example    # Environment variable template
    └── .gitignore
```

---

## Features

- User registration with username, email, and password
- Passwords hashed with bcrypt (12 salt rounds)
- JWT-based authentication (7-day expiry)
- Server-side and client-side input validation
- Duplicate username and email detection
- Protected `/api/auth/me` route
- Session restored on page refresh
- Responsive UI — works on mobile and desktop
- Password strength meter
- Show/hide password toggle

---

## Running locally

### 1. Start the backend

```bash
cd week2-login/backend
npm install
cp .env.example .env
# Open .env and set JWT_SECRET to any long random string
npm run dev
```

The server starts at `http://localhost:5000`.

### 2. Open the frontend

Open `week2-login/frontend/index.html` in your browser, or serve it with VS Code Live Server.

The frontend is configured to talk to `http://localhost:5000` by default.

---

## API endpoints

| Method | Endpoint           | Description                    | Auth required |
| ------ | ------------------ | ------------------------------ | ------------- |
| POST   | /api/auth/register | Create a new account           | No            |
| POST   | /api/auth/login    | Sign in and receive a JWT      | No            |
| GET    | /api/auth/me       | Get the current user's profile | Yes (Bearer)  |
| GET    | /health            | Server health check            | No            |

---

## Deployment

The backend is deployed on [Render](https://render.com).

Set the following environment variables in the Render dashboard:

- `JWT_SECRET` — a long, random secret string
- `JWT_EXPIRES_IN` — e.g. `7d`
- `PORT` — Render sets this automatically

After deploying, update `API_BASE` in `frontend/script.js` to your Render URL:

```js
const API_BASE = "https://your-app-name.onrender.com/api";
```

---

## Technologies used

| Layer    | Technology                        |
| -------- | --------------------------------- |
| Frontend | HTML5, CSS3, JavaScript (ES2020)  |
| Backend  | Node.js, Express                  |
| Auth     | bcryptjs, JSON Web Tokens (JWT)   |
| Storage  | JSON file (users.json)            |
| Deploy   | Render (backend), any static host |
