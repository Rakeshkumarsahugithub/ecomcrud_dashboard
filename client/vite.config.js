import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default {
  build: {
    rollupOptions: {
      external: ['bootstrap/dist/css/bootstrap.min.css']
    }
  }
};

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
})
