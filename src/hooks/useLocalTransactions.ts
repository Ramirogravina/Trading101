import { useEffect, useState } from 'react';
import { Transaction } from '../types/portfolio';

const STORAGE_KEY = 'trading101_transactions_v1';

export const useLocalTransactions = () => {
  const [transactions, setTransactions] = useState<Transaction[]>([]);

  useEffect(() => {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) setTransactions(JSON.parse(raw));
  }, []);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(transactions));
  }, [transactions]);

  return { transactions, setTransactions };
};
