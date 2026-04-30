# Livraria

Livraria is a polished full-stack book management app built with React, Node.js, Express, MongoDB, and JWT auth. It helps users organize books, track reading, manage favorites, recover access by email, and keep a personal profile up to date.

## What it does

- User registration and login
- Email-based password recovery with Nodemailer
- Editable user profile
- Personal library and favorites
- Reading status tracking
- Google Calendar integration
- External book search
- Responsive UI with shared auth state

## Tech Stack

- Frontend: React, React Router, styled-components, Axios
- Backend: Node.js, Express, MongoDB, Mongoose, JWT, bcrypt, Nodemailer
- Tooling: ESLint, GitHub Actions CI

## Project Structure

- `backend/` - API, authentication, database access, and email service
- `frontend/` - web interface, routing, and app state
- `.github/workflows/ci.yml` - automated lint/build checks


## Getting Started

### Prerequisites

- Node.js 18+ recommended
- MongoDB connection string
- Gmail app password or another SMTP provider for password recovery

### Backend

```bash
cd backend
npm install
npm run dev
```

### Frontend

```bash
cd frontend
npm install
npm start
```

The frontend runs on `http://localhost:3000` by default and the backend on `http://localhost:8001`.

## Vercel Deployment

For Vercel, deploy the `frontend/` folder as the project root.

Recommended setup:

1. Import the repository into Vercel.
2. Set the root directory to `frontend`.
3. Add the environment variable `REACT_APP_API_URL` pointing to the public backend URL.
4. Keep the rewrite rule from `frontend/vercel.json` so React Router works on refresh.

Notes:

- Vercel is the best fit for the frontend in this repository.
- The backend still needs a separate host if you want the full app running in production.
- After deployment, update the backend CORS `FRONTEND_URL` to the Vercel domain.

## Environment Variables

### Backend

Create `backend/.env` from `backend/.env.example` and configure:

- `STRING_CONEXAO_DB` or `MONGO_URI`
- `PORT`
- `JWT_SECRET`
- `FRONTEND_URL`
- `BACKEND_URL`
- `SMTP_HOST`
- `SMTP_USER`
- `SMTP_PASS`
- `SMTP_FROM`
- `SMTP_SECURE`

### Frontend

Create `frontend/.env` from `frontend/.env.example` and configure:

- `REACT_APP_API_URL`

## API Highlights

- `POST /cadastre-se`
- `POST /login`
- `GET /perfil`
- `PUT /perfil`
- `POST /esqueci-minha-senha`
- `POST /validar-codigo-recuperacao`
- `POST /redefinir-senha`

## Quality Checks

The repository already includes GitHub Actions CI that runs:

- backend lint
- frontend production build

Frontend tests live under `frontend/src/tests/`, and the backend has a dedicated `backend/tests/` folder ready for future coverage.

## Why this project is portfolio-ready

- Clear auth flow with secure recovery by email
- Consistent UI system across screens
- Editable profile and personal data persistence
- Separate frontend and backend structure
- CI coverage for the most important checks

## Next Improvements

- Add automated tests for auth and profile flows
- Add deployment links for frontend and backend
- Replace the screenshot placeholders with real captures
- Add a short demo video or GIF to the README
