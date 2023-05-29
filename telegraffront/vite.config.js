import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react(),],
  build: {
    sourcemap: false, // Отключение генерации файлов маппинга
    minify: 'terser',
    terserOptions: {
      format: {
        comments: false, // Удаление комментариев из исходного кода
      },
    },
  },
})
