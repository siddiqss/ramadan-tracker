import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { VitePWA } from 'vite-plugin-pwa'

export default defineConfig({
  plugins: [
    react(),
    VitePWA({
      registerType: 'autoUpdate',
      includeAssets: ['icons/favicon.jpeg', 'icons/*.png'],
      manifest: {
        name: 'Ramadan Tracker',
        short_name: 'Ramadan',
        description: 'Daily 5 checklist, Quran goal, and Suhoor/Iftar times. Privacy-first, offline-ready.',
        theme_color: '#0f172a',
        background_color: '#0f172a',
        display: 'standalone',
        orientation: 'portrait',
        scope: '/',
        start_url: '/',
        icons: [{ src: '/icons/favicon.jpeg', sizes: '1024x1024', type: 'image/jpeg', purpose: 'any maskable' }],
      },
      workbox: {
        globPatterns: ['**/*.{js,css,html,ico,png,jpg,jpeg,svg,woff2}'],
        runtimeCaching: [],
      },
    }),
  ],
})
