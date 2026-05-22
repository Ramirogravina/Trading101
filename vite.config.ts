import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { yahooQuoteProxy, yahooSearchProxy } from './src/server/yahooSearchProxy.js';

export default defineConfig({
  plugins: [react(), {
    name: 'backend-api-proxy',
    configureServer(server) {
      server.middlewares.use('/api/yahoo-search', yahooSearchProxy as any);
      server.middlewares.use('/api/yahoo-quote', yahooQuoteProxy as any);
    },
    configurePreviewServer(server) {
      server.middlewares.use('/api/yahoo-search', yahooSearchProxy as any);
      server.middlewares.use('/api/yahoo-quote', yahooQuoteProxy as any);
    },
  }],
});
