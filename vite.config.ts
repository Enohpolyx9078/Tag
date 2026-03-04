import { defineConfig } from 'vite'
import tailwindcss from '@tailwindcss/vite'

export default defineConfig({
  server: {
    proxy: {
      '/api': 'http://localhost:4000',
    },
  },
  plugins: [
    tailwindcss(),
  ],
})