/// <reference types="vite/client" />

export function registerServiceWorker() {
  if (!import.meta.env.PROD || !('serviceWorker' in navigator)) return;

  window.addEventListener('load', () => {
    navigator.serviceWorker.register('/sw.js').catch(() => {
      // Offline support is an enhancement; app startup must never fail because
      // a browser blocks service workers.
    });
  });
}
