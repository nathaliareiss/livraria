# Livraria Backend

This is the Node.js and Express API for Livraria. It handles authentication, user profile data, password recovery by email, library-related flows, and Google integrations.

## Features

- Registration and login with JWT
- Editable user profile
- Password reset code sent by email
- MongoDB persistence with a local fallback store
- Favorites and reading-state endpoints
- Google Calendar integration

## Environment Variables

Create `backend/.env` from `backend/.env.example`.

### Required

- `STRING_CONEXAO_DB` or `MONGO_URI`
- `JWT_SECRET`
- `FRONTEND_URL`
- `BACKEND_URL`
- `SMTP_HOST`
- `SMTP_USER`
- `SMTP_PASS`
- `SMTP_FROM`

### Optional

- `PORT`
- `SMTP_SECURE`

The backend uses port `8001` by default, and Nodemailer uses port `587` unless configured otherwise in the service.

## Local Setup

```bash
cd backend
npm install
npm run dev
```

## Scripts

- `npm run dev` - start the API in development mode
- `npm start` - run the API in production mode
- `npm run lint` - run ESLint

## Operational Notes

- Do not commit real `.env` values to the repository.
- The password recovery flow requires a working SMTP account.
- The project can fall back to local user storage if MongoDB is not available.
- Backend tests are reserved for the `tests/` folder at the project root of `backend/`.
