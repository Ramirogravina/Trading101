import { FormEvent, useEffect, useState } from 'react';
import { X } from 'lucide-react';
import { AssetType, Transaction } from '../types/portfolio';
import { useYahooSearch } from '../hooks/useYahooSearch';

type Props = {
  open: boolean;
  onClose: () => void;
  onAdd: (tx: Transaction) => void;
  initialTx?: Transaction | null;
};

export const AddTransactionModal = ({ open, onClose, onAdd, initialTx }: Props) => {
  const [ticker, setTicker] = useState('SPY');
  const [type, setType] = useState<AssetType>('ETF');
  const [currency, setCurrency] = useState<'USD' | 'ARS'>('USD');
  const [investedAmount, setInvestedAmount] = useState('1000');
  const [purchaseDate, setPurchaseDate] = useState(new Date().toISOString().slice(0, 10));
  const [purchasePrice, setPurchasePrice] = useState('500');
  const { results, loading } = useYahooSearch(ticker);
  useEffect(() => {
    if (!initialTx) return;
    setTicker(initialTx.ticker);
    setType(initialTx.type);
    setCurrency(initialTx.currency);
    setInvestedAmount(String(initialTx.investedAmount));
    setPurchaseDate(initialTx.purchaseDate);
    setPurchasePrice(String(initialTx.purchasePrice));
  }, [initialTx, open]);
  if (!open) return null;

  const submit = (e: FormEvent) => {
    e.preventDefault();
    onAdd({
      id: initialTx?.id ?? crypto.randomUUID(),
      ticker: ticker.toUpperCase(),
      type,
      currency,
      investedAmount: Number(investedAmount),
      purchaseDate,
      purchasePrice: Number(purchasePrice),
    });
    onClose();
  };

  return <div className="backdrop"><div className="modal"><form onSubmit={submit}>
    <div className="modal-title"><h3>{initialTx ? 'Edit transaction' : 'Add transaction'}</h3><button type="button" onClick={onClose}><X size={18}/></button></div>
    <label>Ticker<input value={ticker} onChange={(e)=>setTicker(e.target.value)} onKeyDown={(e) => {
      if (e.key === 'Enter' && results.length) {
        e.preventDefault();
        const first = results[0];
        setTicker(first.symbol);
        setCurrency(first.symbol.endsWith('.BA') ? 'ARS' : 'USD');
      }
    }} required/></label>
    <div className="suggestions">
      {results.map((a) => <button type="button" key={a.symbol} className="suggestion-item" onClick={() => {
        setTicker(a.symbol);
        const isArs = a.symbol.endsWith('.BA');
        setCurrency(isArs ? 'ARS' : 'USD');
      }}>{a.shortname} ({a.symbol})</button>)}
      {loading && <p className="muted">Buscando...</p>}
      {!results.length && ticker.trim() && !loading && <p className="muted">Sin resultados. Verificá conexión al endpoint de búsqueda Yahoo.</p>}
    </div>
    <label>Tipo de activo<select value={type} onChange={(e)=>setType(e.target.value as AssetType)}><option>CEDEAR</option><option>Bono</option><option>ETF</option><option>Acción USA</option></select></label>
    <label>Moneda<select value={currency} onChange={(e)=>setCurrency(e.target.value as 'USD' | 'ARS')}><option value="USD">USD</option><option value="ARS">ARS</option></select></label>
    <label>Monto invertido<input type="number" value={investedAmount} onChange={(e)=>setInvestedAmount(e.target.value)} required/></label>
    <label>Fecha de compra<input type="date" value={purchaseDate} onChange={(e)=>setPurchaseDate(e.target.value)} required/></label>
    <label>Precio de compra ({currency})<input type="number" value={purchasePrice} onChange={(e)=>setPurchasePrice(e.target.value)} required/></label>
    <button className="btn" type="submit">Guardar</button>
  </form></div></div>;
};
