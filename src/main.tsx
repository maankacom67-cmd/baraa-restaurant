import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import App from './App.tsx';
import './index.css';

// Mount React application immediately
const rootElement = document.getElementById('root');
if (rootElement) {
  createRoot(rootElement).render(
    <StrictMode>
      <App />
    </StrictMode>,
  );
}

// Progressive Web App (PWA) Service Worker Registration & Environment Management
if (typeof window !== 'undefined' && 'serviceWorker' in navigator) {
  const isDevHost = Boolean(
    !import.meta.env.PROD ||
    window.location.hostname.includes('run.app') ||
    window.location.hostname === 'localhost' ||
    window.location.hostname === '127.0.0.1' ||
    window.location.hostname.includes('webcontainer')
  );

  if (isDevHost) {
    // In development and preview environments, unregister any active service worker
    // and purge cache storage to prevent duplicate React instances and stale chunks
    navigator.serviceWorker.getRegistrations().then((registrations) => {
      for (const registration of registrations) {
        registration.unregister().catch(() => {});
      }
    }).catch(() => {});

    if ('caches' in window) {
      caches.keys().then((keys) => {
        for (const key of keys) {
          caches.delete(key).catch(() => {});
        }
      }).catch(() => {});
    }
  } else {
    // Production Service Worker registration (e.g. Netlify custom domain)
    window.addEventListener('load', () => {
      navigator.serviceWorker
        .register('/sw.js', { scope: '/' })
        .then((registration) => {
          registration.update().catch(() => {});
          registration.addEventListener('updatefound', () => {
            const installingWorker = registration.installing;
            if (installingWorker) {
              installingWorker.addEventListener('statechange', () => {
                if (installingWorker.state === 'installed' && navigator.serviceWorker.controller) {
                  installingWorker.postMessage({ type: 'SKIP_WAITING' });
                }
              });
            }
          });
        })
        .catch((err) => {
          console.warn('[BARAA PWA] Service Worker registration skipped:', err);
        });

      let hadController = Boolean(navigator.serviceWorker.controller);
      let isRefreshing = false;
      navigator.serviceWorker.addEventListener('controllerchange', () => {
        if (!hadController) {
          hadController = true;
          return;
        }
        if (!isRefreshing) {
          isRefreshing = true;
          window.location.reload();
        }
      });
    });
  }
}
