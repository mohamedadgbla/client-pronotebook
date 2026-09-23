# ProNotebook Frontend (React + Vite)

The web client for the ProNotebook API. Built with React 18, React Router 6, Axios, and
react-markdown.

## Features
- Register / login with JWT (access + refresh)
- **Automatic token refresh** via an Axios interceptor (retries the request after refreshing)
- Protected routes (redirect to login when logged out)
- Dashboard with live stats
- Notebooks (create, open, move to trash)
- Notes list with search + pagination
- Markdown note editor with live preview, favorite/pin toggles
- Trash (restore / permanently delete / empty)

## Getting started
```bash
cd frontend
npm install
cp .env.example .env     # VITE_API_URL should point at your backend
npm run dev              # http://localhost:5173
```
Make sure the backend is running first (default `http://localhost:5000/api/v1`) and that its
`CLIENT_URL` matches this app's origin so CORS allows requests.

## Project structure
```
src/
├── api/client.js          # axios instance + token store + refresh interceptor
├── context/AuthContext.jsx# login/register/logout + current user
├── components/            # Layout, ProtectedRoute
├── pages/                 # Login, Register, Dashboard, Notebooks, NotebookNotes, NoteEditor, Trash
├── App.jsx                # routes
├── main.jsx               # app bootstrap
└── index.css              # styling
```

## A note on token storage
For simplicity tokens are kept in `localStorage`. For production, store the **refresh token in
an httpOnly cookie** (immune to XSS) and keep only the short-lived access token in memory.
The backend already supports a cookie-based flow with minor changes.
