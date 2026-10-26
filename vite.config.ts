import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { fileURLToPath, URL } from 'node:url'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url)),
    },
  },
  build: {
    rollupOptions: {
      output: {
        manualChunks(id) {
          if (id.includes('node_modules/firebase/')) {
            return 'firebase-vendor';
          }
          if (id.includes('node_modules/@xyflow/')) {
            return 'flow-vendor';
          }
          if (id.includes('node_modules/html2canvas/')) {
            return 'canvas-vendor';
          }
          if (id.includes('node_modules/jspdf/')) {
            return 'pdf-vendor';
          }
          if (id.includes('node_modules/xlsx/')) {
            return 'xlsx-vendor';
          }
        },
      },
    },
    chunkSizeWarningLimit: 600,
  },
})
