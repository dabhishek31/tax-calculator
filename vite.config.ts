import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  ssr: {
    // Force Vite to bundle these ESM-only packages for SSR instead of loading them natively
    noExternal: ['react-helmet-async'],
  },
  build: {
    rollupOptions: {
      output: {
        manualChunks: {
          // Split vendor from app code
          'react-vendor': ['react', 'react-dom', 'react-router-dom', 'react-helmet-async'],
          // jsPDF + html2canvas are large and only needed for PDF download — lazy load them
          'pdf-export': ['jspdf', 'html2canvas'],
        },
      },
    },
    // Raise warning threshold — the split chunks are now well under 500kB
    chunkSizeWarningLimit: 600,
  },
})
