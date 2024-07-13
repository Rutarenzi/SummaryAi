import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// https://vitejs.dev/config/
export default defineConfig({
  root: './',
  build: {
    outDir: 'src/frontend/dist',
    emptyOutDir: true,
    rollupOptions: {
      input: {
        main: './src/frontend/index.html'
      }
    },
    chunkSizeWarningLimit: 1000, // 1MB in kilobytes
  },
  plugins: [react()],
  assetsInclude: "**/*.html"
});
