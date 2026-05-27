import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
// import mkcert from 'vite-plugin-mkcert';
import { VitePWA } from 'vite-plugin-pwa';
import fs from 'fs';
import path from 'path';

// Ваш локальный IP
const TARGET_API = "http://10.74.47.153:8080"; 

export default defineConfig({
  //base: "/",
  plugins: [
    react(),
    // mkcert(), 
    VitePWA({
      registerType: 'autoUpdate',
      devOptions: { enabled: true },
      manifest: {
        name: "Orbit Calculator",
        short_name: "OrbitCalc",
        start_url: "/",
        display: "standalone",
        background_color: "#0b0d14",
        theme_color: "#3b82f6",
        icons: [{ src: "/planet.svg", type: "image/svg+xml", sizes: "512x512" }]
      }
    })
  ] as any,
  server: {
    host: true,
    https: false,
    proxy: {
      "/api": {
        target: TARGET_API,
        changeOrigin: true,
        secure: false,
      },
      "/img-proxy": {
        target: "http://10.74.47.153:9000",
        changeOrigin: true,
        secure: false,
      }
    }
    
  }
});