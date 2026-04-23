import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import tailwindcss from '@tailwindcss/vite';

export default defineConfig({
  plugins: [react(), tailwindcss()],
  build: {
    target: 'es2022',
    cssCodeSplit: false,
    // Compress JS with esbuild (default, fastest) — terser would shave ~5%
    // more but is not worth the 10× build time for this site.
    minify: 'esbuild',
    rollupOptions: {
      output: {
        manualChunks: {
          // React + ReactDOM in their own chunk so the cache survives edits
          // to the body HTML blob (which changes on every content tweak).
          react: ['react', 'react-dom'],
        },
      },
    },
  },
});
