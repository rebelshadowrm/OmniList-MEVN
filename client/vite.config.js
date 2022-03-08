import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import * as path from "path";

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [vue()],
  build: {
    emptyOutDir: true,
    outDir: path.resolve(__dirname, '../server/public'),
  },
  server: {
    proxy: {
      '/api': {
        target: 'http://localhost:5000'
      }
    }
  }
})
