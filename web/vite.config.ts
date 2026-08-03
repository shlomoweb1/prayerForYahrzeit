import path from 'node:path'
import tailwindcss from '@tailwindcss/vite'
import { tanstackRouter } from '@tanstack/router-plugin/vite'
import react from '@vitejs/plugin-react'
import { defineConfig } from 'vite'
import { VitePWA } from 'vite-plugin-pwa'

export default defineConfig({
  plugins: [
    tanstackRouter({
      routesDirectory: './src/routes',
      generatedRouteTree: './src/routeTree.gen.ts',
    }),
    react(),
    tailwindcss(),
    VitePWA({
      registerType: 'autoUpdate',
      includeAssets: ['favicon.svg', 'icons.svg'],
      manifest: {
        name: 'יזכור — דף זיכרון להדפסה',
        short_name: 'יזכור',
        description: 'יצירת דף יזכור להדפסה — מזכרת נשמה עם תהילים, קדיש ומשניות',
        lang: 'he',
        dir: 'rtl',
        theme_color: '#863bff',
        background_color: '#ffffff',
        display: 'standalone',
        start_url: '/',
        scope: '/',
        icons: [
          { src: '/icons/icon-192.png', sizes: '192x192', type: 'image/png' },
          { src: '/icons/icon-512.png', sizes: '512x512', type: 'image/png' },
          {
            src: '/icons/maskable-icon-512.png',
            sizes: '512x512',
            type: 'image/png',
            purpose: 'maskable',
          },
        ],
      },
      workbox: {
        globPatterns: ['**/*.{js,css,html,svg,png,ttf,otf}'],
        globIgnores: ['**/wasm/**'],
        // SPA: every navigation offline serves the app shell (routes render
        // client-side from the URL).
        navigateFallback: '/index.html',
        runtimeCaching: [
          {
            // folio.wasm (16 MB) is NOT precached — see P6-03 report note.
            // After the first PDF render it is cached here for offline reuse.
            urlPattern: /\/wasm\/.*/i,
            handler: 'CacheFirst',
            options: {
              cacheName: 'folio-wasm',
              expiration: { maxEntries: 3, maxAgeSeconds: 60 * 60 * 24 * 30 },
            },
          },
        ],
      },
      devOptions: {
        enabled: true,
        type: 'module',
      },
    }),
  ],
  resolve: {
    alias: {
      '@': path.resolve(import.meta.dirname, './src'),
    },
  },
})
