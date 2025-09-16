import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import tailwindcss from '@tailwindcss/vite';
import { VitePWA } from 'vite-plugin-pwa';

export default defineConfig({
  build: {
    sourcemap: false, // Disable source maps in production
  },
  css: {
    devSourcemap: false, // Disable CSS source maps in development
  },
  esbuild: {
    sourcemap: false, // Disable JavaScript source maps in development
  },
  server: {
    host: '0.0.0.0',  
    port: 5173,
    hmr: false, // Disable Hot Module Replacement to force bundling
  },
  optimizeDeps: {
    force: true, // Force pre-bundling of dependencies
  },
  plugins: [
    tailwindcss(), 
    react(),
    VitePWA({
      registerType: 'autoUpdate',
      workbox: {
        globPatterns: ['**/*.{js,css,html,ico,png,svg,json,vue,txt,woff2}']
      },
      includeAssets: ['favicon.ico', 'apple-touch-icon.png', 'mask-icon.svg'],
      manifest: {
        name: 'School ERP Management System',
        short_name: 'School ERP',
        description: 'Complete School Management System for Administration, Students, and Teachers',
        theme_color: '#1976d2',
        background_color: '#ffffff',
        display: 'standalone',
        orientation: 'portrait',
        scope: '/',
        start_url: '/',
        icons: [
          {
            src: 'pwa-192x192.png',
            sizes: '192x192',
            type: 'image/png'
          },
          {
            src: 'pwa-512x512.png',
            sizes: '512x512',
            type: 'image/png'
          },
          {
            src: 'pwa-512x512.png',
            sizes: '512x512',
            type: 'image/png',
            purpose: 'any maskable'
          }
        ]
      }
    })
  ],
});
