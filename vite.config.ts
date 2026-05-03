import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

export default defineConfig({
  plugins: [react(), tailwindcss()],
  build: {
    rollupOptions: {
      output: {
        manualChunks: (id: string) => {
          if (id.includes('node_modules/three') || id.includes('@react-three') || id.includes('@react-spring/three')) {
            return 'three-vendor';
          }
          if (id.includes('node_modules/react') || id.includes('react-dom') || id.includes('react-router') || id.includes('framer-motion')) {
            return 'react-vendor';
          }
        },
      },
    },
  },
})
