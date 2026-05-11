/// <reference types="vitest" />
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react-swc'
import svgr from 'vite-plugin-svgr'
import path from 'node:path'

// https://vite.dev/config/
export default defineConfig({
  base: '/',
  server: {
    port: 5174
  },
  plugins: [react(), svgr()],
  resolve: {
    alias: [
      { find: '~', replacement: path.resolve(__dirname, 'src') }
    ]
  },
  test: {
    globals: true,
    environment: 'jsdom',
    setupFiles: './src/test/setup.js',
    css: false,
    coverage: {
      provider: 'v8',
      reporter: ['text', 'html'],
      exclude: [
        'node_modules/',
        'src/test/',
        'src/main.jsx',
        '**/*.config.*',
        'src/assets/**'
      ]
    }
  }
})
