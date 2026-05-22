import { FormEvent, useState } from 'react';
import { X } from 'lucide-react';
import { AssetType, Transaction } from '../types/portfolio';

type Props = {
  open: boolean;
  onClose: () => void;
  onAdd: (tx: Transaction) => void;
};

export const AddTransactionModal = ({ open, onClose, onAdd }: Props) => {
  const [ticker, setTicker] = useState('SPY');
  const [type, setType] = useState<AssetType>('ETF');
  const [currency, setCurrency] = useState<'USD' | 'ARS'>('USD');
  const [investedAmount, setInvestedAmount] = useState('1000');
  const [purchaseDate, setPurchaseDate] = useState(new Date().toISOString().slice(0, 10));
  const [purchasePrice, setPurchasePrice] = useState('500');
  if (!open) return null;

  const submit = (e: FormEvent) => {
    e.preventDefault();
    onAdd({
      id: crypto.randomUUID(),
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
    <div className="modal-title"><h3>Add transaction</h3><button type="button" onClick={onClose}><X size={18}/></button></div>
    <label>Ticker<input value={ticker} onChange={(e)=>setTicker(e.target.value)} required/></label>
    <label>Tipo de activo<select value={type} onChange={(e)=>setType(e.target.value as AssetType)}><option>CEDEAR</option><option>Bono</option><option>ETF</option><option>Acción USA</option></select></label>
    <label>Moneda<select value={currency} onChange={(e)=>setCurrency(e.target.value as 'USD' | 'ARS')}><option value="USD">USD</option><option value="ARS">ARS</option></select></label>
    <label>Monto invertido<input type="number" value={investedAmount} onChange={(e)=>setInvestedAmount(e.target.value)} required/></label>
    <label>Fecha de compra<input type="date" value={purchaseDate} onChange={(e)=>setPurchaseDate(e.target.value)} required/></label>
    <label>Precio de compra ({currency})<input type="number" value={purchasePrice} onChange={(e)=>setPurchasePrice(e.target.value)} required/></label>
    <button className="btn" type="submit">Guardar</button>
  </form></div></div>;
};
