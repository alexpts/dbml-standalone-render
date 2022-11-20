import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'

process.env.NODE_ENV = process.env.NODE_ENV || 'development';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [vue()]
})
