import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import tailwindcss from '@tailwindcss/vite';
import compression from 'vite-plugin-compression';

export default defineConfig({
  build: {
    chunkSizeWarningLimit: 1000,
    rollupOptions: {
      output: {
        manualChunks: {
          'firebase': ['firebase/app', 'firebase/auth', 'firebase/firestore', 'firebase/analytics', 'firebase/storage'],
          'react-vendor': ['react', 'react-dom'],
        }
      }
    }
  },
  plugins: [
    react(), 
    tailwindcss(),
    compression({
      algorithm: 'gzip',
      ext: '.gz',
    })
  ],
});
