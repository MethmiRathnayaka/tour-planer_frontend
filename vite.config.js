import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
    base: '/tour-planer_frontend/', // ← this line is critical
    plugins: [react()],
})
