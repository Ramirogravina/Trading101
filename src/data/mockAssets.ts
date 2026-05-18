import { Asset } from '../types/portfolio';

export const mockAssets: Asset[] = [
  { ticker: 'SPY', name: 'SPDR S&P 500 ETF', type: 'ETF', currency: 'USD', currentPrice: 531.2 },
  { ticker: 'AAPL', name: 'Apple Inc.', type: 'Acción USA', currency: 'USD', currentPrice: 202.4 },
  { ticker: 'GGAL', name: 'Grupo Galicia CEDEAR', type: 'CEDEAR', currency: 'ARS', currentPrice: 12280 },
  { ticker: 'AL30', name: 'Bono AL30', type: 'Bono', currency: 'USD', currentPrice: 51.7 },
  { ticker: 'KO', name: 'Coca-Cola CEDEAR', type: 'CEDEAR', currency: 'ARS', currentPrice: 19100 },
];
