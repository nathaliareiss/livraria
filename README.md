# Livraria

A polished full-stack book management app with favorites, a personal library, reading tracking, and Google Calendar integration.

## Tech Stack

- Backend: Node.js, Express, MongoDB, Mongoose, JWT, bcrypt, Google APIs
- Frontend: React, React Router, styled-components, Axios

## Project Structure

- `backend/`: API, authentication, models, and integrations
- `frontend/`: web interface and API consumption
- `livros.json` and `favoritos.json`: local seed/support data

## Local Setup

1. Install dependencies in both `backend` and `frontend`.
2. Copy the example environment files.
3. Start the backend on port `8000`.
4. Start the frontend on port `3000`.

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

## Environment Variables

Copy the example files:

- `backend/.env.example` to `backend/.env`
- `frontend/.env.example` to `frontend/.env`

## Highlights

- User-specific favorites persisted in MongoDB
- Google Calendar flow without exposing tokens in the URL
- Environment-based API and frontend URLs
- Cleaner production-ready frontend visual system
- Accessibility and build warnings addressed

## Next Improvements

- Add automated tests for critical flows
- Add a CI workflow for linting and build validation
- Include screenshots or a short demo video
- Add deployment notes for the backend and frontend
