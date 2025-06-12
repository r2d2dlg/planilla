import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    // Aquí puedes establecer el puerto que desees
    // por ejemplo: 3000, 4000, 8080, etc.
    port: 4000, 
    proxy: {
      // Opcional: Proxy para redirigir las llamadas API al backend
      // '/api': {
      //   target: 'http://localhost:5000',
      //   changeOrigin: true,
      //   secure: false,
      // },
    },
  },
})