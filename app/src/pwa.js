// Service worker registration.
//
// The update model deliberately mirrors what the app already did when it was a
// thin WebView over a remote URL: a new deploy is picked up on the next cold
// start. The difference is that the shell now comes from cache first, so the
// app keeps working when the network — or GitHub Pages — doesn't.
//
// Callers get notified when a newer version is waiting, so the user can take it
// immediately instead of waiting for a restart.

import { registerSW } from 'virtual:pwa-register';

const listeners = new Set();
let applyUpdate = null;
let updateReady = false;

export function onUpdateAvailable(listener) {
    listeners.add(listener);
    // A worker may already be waiting by the time the UI subscribes.
    if (updateReady) listener();
    return () => listeners.delete(listener);
}

/**
 * Activates the waiting worker and reloads onto the new version.
 */
export function applyPendingUpdate() {
    if (applyUpdate) applyUpdate(true);
}

export function registerServiceWorker() {
    if (typeof window === 'undefined' || !('serviceWorker' in navigator)) return;

    applyUpdate = registerSW({
        onNeedRefresh() {
            updateReady = true;
            listeners.forEach(fn => fn());
        },
        onRegisteredSW(_url, registration) {
            if (!registration) return;
            // Look for a new deploy on launch and hourly for long-lived sessions.
            registration.update().catch(() => { });
            setInterval(() => registration.update().catch(() => { }), 60 * 60 * 1000);
        },
        onRegisterError(error) {
            console.warn('[Valor] Service worker registration failed:', error);
        },
    });
}
