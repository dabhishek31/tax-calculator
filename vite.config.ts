import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig(({ isSsrBuild }) => ({
  plugins: [react()],
  ssr: {
    noExternal: ['react-helmet-async'],
  },
  build: {
    rollupOptions: {
      // manualChunks only applies to the client bundle — SSR externalises these packages
      output: isSsrBuild ? {} : {
        manualChunks: {
          'react-vendor': ['react', 'react-dom', 'react-router-dom', 'react-helmet-async'],
          'pdf-export': ['jspdf', 'html2canvas'],
        },
      },
    },
    chunkSizeWarningLimit: 600,
  },
}))
