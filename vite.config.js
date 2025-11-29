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
      registerType: 'prompt', // no registra automáticamente el SW
      injectRegister: false,  // evita que VitePWA inyecte el registro
      workbox: undefined,     // desactiva la caché completamente
      includeAssets: [
        'favicon.ico',
        'robots.txt',
        'apple-touch-icon.png',
        'icons/icon-192x192.png',
        'icons/icon-512x512.png'
      ],
      manifest: {
        name: 'Kiosco',
        short_name: 'Kiosco',
        description: 'Una app para gestion de kiosco',
        start_url: '/',
        display: 'standalone',
        background_color: '#ffffff',
        theme_color: '#25D366',
        icons: [
          {
            src: '/icons/icon-192x192.png',
            sizes: '192x192',
            type: 'image/png'
          },
          {
            src: '/icons/icon-512x512.png',
            sizes: '512x512',
            type: 'image/png'
          },
          {
            src: '/icons/icon-512x512.png',
            sizes: '512x512',
            type: 'image/png',
            purpose: 'any maskable'
          }
        ]
      }
    })
  ]
})
