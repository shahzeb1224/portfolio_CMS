import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { fileURLToPath, URL } from 'node:url'

// The preview harness assigns a free port via the PORT env var; fall back to
// 5173 for a plain `npm run dev`.
declare const process: { env: Record<string, string | undefined> }
const port = process.env.PORT ? Number(process.env.PORT) : 5173

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url)),
    },
  },
  server: {
    port,
    host: true,
    strictPort: false,
  },
  build: {
    outDir: 'dist',
    sourcemap: false,
    rollupOptions: {
      output: {
        manualChunks: {
          react: ['react', 'react-dom', 'react-router-dom'],
          motion: ['framer-motion'],
          markdown: ['react-markdown', 'remark-gfm'],
        },
      },
    },
  },
})
