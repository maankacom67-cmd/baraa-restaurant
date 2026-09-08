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

// Progressive Web App (PWA) Service Worker Registration & Instant Update Manager
if (typeof window !== 'undefined' && 'serviceWorker' in navigator) {
  window.addEventListener('load', () => {
    // Only attempt registration in secure contexts or localhost
    const isLocalhost = Boolean(
      window.location.hostname === 'localhost' ||
      window.location.hostname === '[::1]' ||
      window.location.hostname.match(/^127(?:\.(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)){3}$/)
    );

    if (window.location.protocol !== 'https:' && !isLocalhost) {
      console.log('[BARAA PWA] Service Worker requires HTTPS or localhost');
      return;
    }

    navigator.serviceWorker
      .register('/sw.js', { scope: '/' })
      .then((registration) => {
        console.log('[BARAA PWA] Service Worker registered with scope:', registration.scope);

        // Check for updates on register
        registration.update().catch(() => {});

        // Listen for new worker installation (new menu, price, or code update published)
        registration.addEventListener('updatefound', () => {
          const installingWorker = registration.installing;
          if (installingWorker) {
            installingWorker.addEventListener('statechange', () => {
              if (installingWorker.state === 'installed' && navigator.serviceWorker.controller) {
                console.log('[BARAA PWA] New update published! Activating immediately...');
                installingWorker.postMessage({ type: 'SKIP_WAITING' });
              }
            });
          }
        });
      })
      .catch((err) => {
        console.warn('[BARAA PWA] Service Worker registration skipped/failed:', err);
      });

    // Handle seamless refresh when new service worker takes control
    let isRefreshing = false;
    navigator.serviceWorker.addEventListener('controllerchange', () => {
      if (!isRefreshing) {
        isRefreshing = true;
        console.log('[BARAA PWA] App updated to latest version.');
        window.location.reload();
      }
    });

    // Check for updates periodically (every 15 minutes)
    setInterval(() => {
      navigator.serviceWorker.getRegistration().then((reg) => {
        reg?.update().catch(() => {});
      });
    }, 15 * 60 * 1000);

    // Check for updates when user refocuses the app or regains internet connection
    window.addEventListener('focus', () => {
      navigator.serviceWorker.getRegistration().then((reg) => {
        reg?.update().catch(() => {});
      });
    });

    window.addEventListener('online', () => {
      navigator.serviceWorker.getRegistration().then((reg) => {
        reg?.update().catch(() => {});
      });
    });
  });
}
