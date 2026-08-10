import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { VitePWA } from 'vite-plugin-pwa'

// https://vite.dev/config/
// Surfaced in Settings so a user can tell you exactly which build they're on.
const BUILD_ID = new Date().toISOString().slice(0, 16).replace('T', ' ');

export default defineConfig({
  base: '/valor-training-app/',
  define: {
    __BUILD_ID__: JSON.stringify(BUILD_ID),
  },
  plugins: [
    react(),
    // The Android app is a WebView pointed at the deployed URL, so a GitHub
    // Pages outage used to take every installed copy down with it. Precaching
    // the whole shell means the app launches from cache and only reaches the
    // network to look for a newer version.
    VitePWA({
      registerType: 'prompt',
      injectRegister: null, // registered manually in src/pwa.js
      includeAssets: ['apple-touch-icon.png', 'logo.png'],
      manifest: {
        name: 'Valor Training',
        short_name: 'Valor',
        description:
          'Your AI Fitness Architect. Premium workout generation for home and gym training.',
        theme_color: '#0a0a0f',
        background_color: '#0a0a0f',
        display: 'standalone',
        orientation: 'portrait',
        scope: '/valor-training-app/',
        start_url: '/valor-training-app/',
        icons: [
          { src: 'pwa-192.png', sizes: '192x192', type: 'image/png' },
          { src: 'pwa-512.png', sizes: '512x512', type: 'image/png' },
          {
            src: 'pwa-maskable-512.png',
            sizes: '512x512',
            type: 'image/png',
            purpose: 'maskable',
          },
        ],
      },
      workbox: {
        globPatterns: ['**/*.{js,css,html,png,svg,ico,woff2}'],
        // Images are large; the default 2 MiB ceiling would silently drop them.
        maximumFileSizeToCacheInBytes: 4 * 1024 * 1024,
        navigateFallback: '/valor-training-app/index.html',
        cleanupOutdatedCaches: true,
        // Let the new worker wait rather than seizing control — a forced reload
        // mid-workout would discard the generated session. It activates on the
        // next cold start, or immediately if the user taps Update.
        skipWaiting: false,
        clientsClaim: false,
        runtimeCaching: [
          {
            // Google Fonts stylesheet — keep the cached copy usable offline.
            urlPattern: /^https:\/\/fonts\.googleapis\.com\/.*/i,
            handler: 'StaleWhileRevalidate',
            options: { cacheName: 'google-fonts-stylesheets' },
          },
          {
            urlPattern: /^https:\/\/fonts\.gstatic\.com\/.*/i,
            handler: 'CacheFirst',
            options: {
              cacheName: 'google-fonts-webfonts',
              expiration: { maxEntries: 20, maxAgeSeconds: 60 * 60 * 24 * 365 },
              cacheableResponse: { statuses: [0, 200] },
            },
          },
        ],
      },
      devOptions: { enabled: false },
    }),
  ],
})
