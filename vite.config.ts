import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'path';

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
  optimizeDeps: {
    include: ['@supabase/supabase-js']
  },
  server: {
    proxy: {
      '/.supabase/auth': {
        target: 'https://blbfmoddnuoxsezajhwy.supabase.co',
        changeOrigin: true,
        secure: false,
      }
    }
  }
});