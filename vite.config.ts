import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { yahooSearchProxy } from './src/server/yahooSearchProxy';

export default defineConfig({
  plugins: [react(), {
    name: 'yahoo-search-api',
    configureServer(server) {
      server.middlewares.use('/api/yahoo-search', yahooSearchProxy as any);
    },
    configurePreviewServer(server) {
      server.middlewares.use('/api/yahoo-search', yahooSearchProxy as any);
    },
  }],
});
