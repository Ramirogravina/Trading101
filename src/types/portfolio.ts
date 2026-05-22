export type AssetType = 'CEDEAR' | 'Bono' | 'ETF' | 'Acción USA';

export interface Asset {
  ticker: string;
  name: string;
  type: AssetType;
  currency: 'USD' | 'ARS';
  currentPrice: number;
}

export interface Transaction {
  id: string;
  ticker: string;
  type: AssetType;
  currency: 'USD' | 'ARS';
  investedAmount: number;
  purchaseDate: string;
  purchasePrice: number;
  currentPriceOverride?: number;
}

export interface Holding {
  ticker: string;
  type: AssetType;
  investedAmount: number;
  shares: number;
  avgCost: number;
  currentPrice: number;
  currentValue: number;
  pnl: number;
  returnPct: number;
  allocationPct: number;
}

export interface WatchlistItem {
  symbol: string;
  name: string;
  exchange?: string;
}
