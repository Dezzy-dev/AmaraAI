import { sentryVitePlugin } from "@sentry/vite-plugin";
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react(), sentryVitePlugin({
    org: "amara-f6",
    project: "amara-ai"
  })],

  optimizeDeps: {
    exclude: ['lucide-react'],
  },

  build: {
    sourcemap: true
  }
});