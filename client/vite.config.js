import path from "path"
import react from "@vitejs/plugin-react"
import { defineConfig } from "vite"
import dotenv from 'dotenv';


dotenv.config();

export default defineConfig({
  server: {
    proxy: {
      '/api': {
        // target: process.env.VITE_REACT_APP_BACKEND_URL,
        target: "http://localhost:3000",
        changeOrigin: true,
        secure: false,
      },
    },
  },
  plugins: [react()],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
})
