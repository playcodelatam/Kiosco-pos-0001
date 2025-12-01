import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { VitePWA } from 'vite-plugin-pwa'

export default defineConfig({
  server: {
    host: '0.0.0.0',
    port: 5173,
    strictPort: true,
    allowedHosts: ['.gitpod.dev', '.gitpod.io'],
    hmr: {
      clientPort: 5173
    }
  },
  plugins: [
    react(),
    VitePWA({
      registerType: 'prompt',
      injectRegister: false,
      workbox: undefined,
      includeAssets: [
        'img/logoKiosco.webp',
        'icons/icon-192-192.png',
        'icons/icon-512x512.png'
      ],
      manifest: {
        name: 'Admin POS',
        short_name: 'Admin POS',
        description: 'Sistema de Punto de Venta - Administración y Gestión',
        start_url: '/',
        display: 'standalone',
        background_color: '#4DAAA7',
        theme_color: '#4DAAA7',
        orientation: 'portrait-primary',
        icons: [
          {
            src: '/img/logoKiosco.webp',
            sizes: '192x192',
            type: 'image/webp',
            purpose: 'any maskable'
          },
          {
            src: '/img/logoKiosco.webp',
            sizes: '512x512',
            type: 'image/webp',
            purpose: 'any maskable'
          },
          {
            src: '/icons/icon-192-192.png',
            sizes: '192x192',
            type: 'image/png',
            purpose: 'any'
          },
          {
            src: '/icons/icon-512x512.png',
            sizes: '512x512',
            type: 'image/png',
            purpose: 'any'
          }
        ]
      }
    })
  ]
})
