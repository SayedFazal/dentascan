import tailwindcss from '@tailwindcss/vite';
import react from '@vitejs/plugin-react';
import path from 'path';
import {defineConfig, loadEnv} from 'vite';

export default defineConfig(({mode}) => {
  const env = loadEnv(mode, '.', '');

  // Log environment variables for debugging
  if (mode === 'development') {
    console.log('[VITE] Loading environment:');
    console.log('  VITE_API_URL:', env.VITE_API_URL || '(not set - using relative paths)');
    console.log('  NODE_ENV:', process.env.NODE_ENV);
  }

  return {
    plugins: [react(), tailwindcss()],
    define: {
      'process.env.GEMINI_API_KEY': JSON.stringify(env.GEMINI_API_KEY),
      'process.env.DEBUG': JSON.stringify(process.env.DEBUG),
    },
    resolve: {
      alias: {
        '@': path.resolve(__dirname, 'src'),
      },
    },
    server: {
      port: 3000,
      host: true,
      hmr: process.env.DISABLE_HMR !== 'true',
      // Explicitly allow all origins for development (for Android testing)
      middlewareMode: false,
    },
  };
});
