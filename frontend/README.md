# Livraria Frontend

This is the React interface for the Livraria project. It provides the user experience for registration, login, profile editing, password recovery, library management, and reading tracking.

## Main Routes

- `/` - Home
- `/cadastre-se` - Registration
- `/login` - Login
- `/recuperar-senha` - Password recovery
- `/perfil` - User profile
- `/calendario` - Calendar
- `/estante` - Personal library

## Tech Stack

- React 19
- React Router DOM
- styled-components
- Axios

## Local Setup

```bash
cd frontend
npm install
npm start
```

Create `frontend/.env` from `frontend/.env.example`:

```env
REACT_APP_API_URL=http://localhost:8001
```

## Notes

- The frontend expects the backend API to be available.
- Authentication state is stored in `localStorage` and kept in sync through the auth context.
- The profile screen supports editing the saved user information.
- Frontend tests live under `src/tests/`.

## Build

```bash
npm run build
```

## Deployment Tips

- Point `REACT_APP_API_URL` to the public API URL in production.
- Make sure the backend allows the deployed frontend origin through `FRONTEND_URL`.
