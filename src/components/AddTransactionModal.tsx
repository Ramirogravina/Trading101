import { FormEvent, useMemo, useState, useEffect } from 'react';
import { X } from 'lucide-react';
import { AssetType, Transaction } from '../types/portfolio';
import { mockAssets } from '../data/mockAssets';

type Props = {
  open: boolean;
  onClose: () => void;
  onSave: (tx: Transaction) => void;
  initial?: Transaction | null;
};

export const AddTransactionModal = ({ open, onClose, onSave, initial }: Props) => {
  const [query, setQuery] = useState('SPY');
  const [ticker, setTicker] = useState('SPY');
  const [type, setType] = useState<AssetType>('ETF');
  const [investedAmount, setInvestedAmount] = useState('1000');
  const [investedCurrency, setInvestedCurrency] = useState<'USD' | 'ARS'>('ARS');
  const [purchaseDate, setPurchaseDate] = useState(new Date().toISOString().slice(0, 10));
  const [purchasePrice, setPurchasePrice] = useState('500');
  const [purchaseCurrency, setPurchaseCurrency] = useState<'USD' | 'ARS'>('USD');

  useEffect(() => {
    if (!open) return;
    if (!initial) return;
    setTicker(initial.ticker);
    setQuery(initial.ticker);
    setType(initial.type);
    setInvestedAmount(String(initial.investedAmount));
    setInvestedCurrency(initial.investedCurrency);
    setPurchaseDate(initial.purchaseDate);
    setPurchasePrice(String(initial.purchasePrice));
    setPurchaseCurrency(initial.purchaseCurrency);
  }, [open, initial]);

  const options = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return mockAssets;
    return mockAssets.filter((a) => a.ticker.toLowerCase().includes(q) || a.name.toLowerCase().includes(q));
  }, [query]);

  if (!open) return null;

  const submit = (e: FormEvent) => {
    e.preventDefault();
    onSave({
      id: initial?.id ?? crypto.randomUUID(),
      ticker: ticker.toUpperCase(),
      type,
      investedAmount: Number(investedAmount),
      investedCurrency,
      purchaseDate,
      purchasePrice: Number(purchasePrice),
      purchaseCurrency,
    });
    onClose();
  };

  return <div className="backdrop"><div className="modal"><form onSubmit={submit}>
    <div className="modal-title"><h3>{initial ? 'Editar transacción' : 'Add transaction'}</h3><button type="button" onClick={onClose}><X size={18}/></button></div>
    <label>Buscar activo
      <input value={query} onChange={(e)=>setQuery(e.target.value)} placeholder="Ej: Tesla, Microsoft, AL30" />
      <div className="suggestions">{options.slice(0, 6).map((a) => <button className="suggestion" type="button" key={a.ticker} onClick={() => { setTicker(a.ticker); setQuery(`${a.name} (${a.ticker})`); setType(a.type); setPurchaseCurrency(a.currency); }}>{a.name} ({a.ticker})</button>)}</div>
    </label>
    <label>Ticker<input value={ticker} onChange={(e)=>setTicker(e.target.value)} required/></label>
    <label>Tipo de activo<select value={type} onChange={(e)=>setType(e.target.value as AssetType)}><option>CEDEAR</option><option>Bono</option><option>ETF</option><option>Acción USA</option></select></label>
    <label>Monto invertido<input type="number" min="0" step="any" value={investedAmount} onChange={(e)=>setInvestedAmount(e.target.value)} required/>
      <select value={investedCurrency} onChange={(e) => setInvestedCurrency(e.target.value as 'USD' | 'ARS')}><option value="ARS">ARS</option><option value="USD">USD</option></select>
    </label>
    <label>Fecha de compra<input type="date" value={purchaseDate} onChange={(e)=>setPurchaseDate(e.target.value)} required/></label>
    <label>Precio de compra<input type="number" min="0.0000001" step="any" value={purchasePrice} onChange={(e)=>setPurchasePrice(e.target.value)} required/>
      <select value={purchaseCurrency} onChange={(e) => setPurchaseCurrency(e.target.value as 'USD' | 'ARS')}><option value="ARS">ARS</option><option value="USD">USD</option></select>
    </label>
    <button className="btn" type="submit">Guardar</button>
  </form></div></div>;
};
