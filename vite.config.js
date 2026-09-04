import react from '@vitejs/plugin-react'
import { defineConfig } from 'vite'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    host: true, // needed so the dev server is reachable from outside the Docker container
    watch: {
      // Docker on Windows doesn't propagate filesystem events through the
      // bind mount, so chokidar needs polling to pick up file changes.
      usePolling: true,
    },
    proxy: {
      '/api': {
        target: process.env.VITE_PROXY_TARGET ?? 'http://localhost:8000',
        changeOrigin: true,
      },
    },
  },
})
