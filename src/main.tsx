import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import { matchRoute } from './routes';
import './index.css';

const root = document.getElementById('root')!;
const app = (
  <React.StrictMode>
    <App />
  </React.StrictMode>
);

// Showcase/Docs/Cases arrive as real prerendered HTML (scripts/prerender.mjs)
// and must hydrate, not re-render from scratch. /app (Engineering) and
// /terminal are never prerendered — both are plain client renders.
const route = matchRoute(window.location.pathname);
if (route === 'engineering' || route === 'terminal') {
  ReactDOM.createRoot(root).render(app);
} else {
  ReactDOM.hydrateRoot(root, app);
}
