import { mockAssets } from '../data/mockAssets';
import { Holding, Transaction } from '../types/portfolio';

export const calculateShares = (investedAmount: number, purchasePrice: number): number => investedAmount / purchasePrice;

export const calculateHoldings = (transactions: Transaction[]): Holding[] => {
  const grouped = new Map<string, Transaction[]>();
  transactions.forEach((tx) => {
    const arr = grouped.get(tx.ticker) ?? [];
    arr.push(tx);
    grouped.set(tx.ticker, arr);
  });

  const raw = Array.from(grouped.entries()).map(([ticker, txs]) => {
    const investedAmount = txs.reduce((sum, tx) => sum + tx.investedAmount, 0);
    const shares = txs.reduce((sum, tx) => sum + calculateShares(tx.investedAmount, tx.purchasePrice), 0);
    const avgCost = investedAmount / shares;
    const fallbackAsset = mockAssets.find((a) => a.ticker === ticker);
    const lastOverride = [...txs].reverse().find((tx) => tx.currentPriceOverride)?.currentPriceOverride;
    const currentPrice = lastOverride ?? fallbackAsset?.currentPrice ?? avgCost;
    const currentValue = shares * currentPrice;
    const pnl = currentValue - investedAmount;
    const returnPct = investedAmount > 0 ? (pnl / investedAmount) * 100 : 0;

    return {
      ticker,
      type: txs[0].type,
      investedAmount,
      shares,
      avgCost,
      currentPrice,
      currentValue,
      pnl,
      returnPct,
      allocationPct: 0,
    };
  });

  const totalValue = raw.reduce((sum, h) => sum + h.currentValue, 0);
  return raw.map((h) => ({ ...h, allocationPct: totalValue > 0 ? (h.currentValue / totalValue) * 100 : 0 }));
};
