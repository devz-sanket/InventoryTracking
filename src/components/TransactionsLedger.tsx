
import React, { useState, useMemo } from 'react';
import { InventoryTransaction, SKU, TransactionType } from '../types';
import { Plus, Search, Calendar, User, FileText, ArrowRight, CornerDownRight } from 'lucide-react';

interface TransactionsLedgerProps {
  transactions: InventoryTransaction[];
  skus: SKU[];
  onAddTransaction: (txn: InventoryTransaction) => void;
}

export default function TransactionsLedger({ transactions, skus, onAddTransaction }: TransactionsLedgerProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [filterType, setFilterType] = useState<string>('ALL');
  const [isLoggedFormOpen, setIsLoggedFormOpen] = useState(false);

  const [selectedSkuId, setSelectedSkuId] = useState('');
  const [txnType, setTxnType] = useState<TransactionType>('INWARD');
  const [quantity, setQuantity] = useState<number>(1);
  const [recordedBy, setRecordedBy] = useState('');
  const [notes, setNotes] = useState('');
  const [source, setSource] = useState('Central Warehouse');
  const [destination, setDestination] = useState('Store Shelf');

  const [formError, setFormError] = useState('');

  const handleTypeChange = (type: TransactionType) => {
    setTxnType(type);
    switch (type) {
      case 'INWARD':
        setSource('Central Warehouse Bangalore');
        setDestination('Store Shelf');
        break;
      case 'OUTWARD_SALE':
        setSource('Store Shelf');
        setDestination('Customer (Counter Cash Checkout)');
        break;
      case 'OUTWARD_DAMAGED':
        setSource('Store Shelf');
        setDestination('Damaged / Quarantine Bin');
        break;
      case 'RETURN_CUSTOMER':
        setSource('Customer Client (Returned)');
        setDestination('Store Shelf / Inspection Room');
        break;
      case 'RETURN_SUPPLIER':
        setSource('Damaged Bin / Counter Backup');
        setDestination('Supplier/Artisans Return (Kumbakonam / Mysore)');
        break;
      case 'RECONCILIATION':
        setSource('Audited Count Mismatch');
        setDestination('Ledger Adjustment');
        break;
    }
  };

  const txnTypes: { type: TransactionType; label: string }[] = [
    { type: 'INWARD', label: 'Inward Receipts' },
    { type: 'OUTWARD_SALE', label: 'Sales counter' },
    { type: 'OUTWARD_DAMAGED', label: 'Damaged Out' },
    { type: 'RETURN_CUSTOMER', label: 'Customer returns' },
    { type: 'RETURN_SUPPLIER', label: 'Supplier Returns' }
  ];

  const handleOpenLogForm = () => {
    setSelectedSkuId(skus[0]?.id || '');
    handleTypeChange('INWARD');
    setQuantity(1);
    setRecordedBy('');
    setNotes('');
    setFormError('');
    setIsLoggedFormOpen(true);
  };

  const handleSubmittingTxn = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedSkuId) {
      setFormError('Please select a valid SKU first.');
      return;
    }
    if (quantity <= 0) {
      setFormError('Quantity must be greater than zero.');
      return;
    }
    if (!recordedBy.trim()) {
      setFormError('Please enter cashier or manager name (Recorded By).');
      return;
    }

    const newTxn: InventoryTransaction = {
      id: `TXN-${Math.floor(1000 + Math.random() * 9000)}`,
      skuId: selectedSkuId,
      type: txnType,
      quantity,
      timestamp: new Date().toISOString(),
      source,
      destination,
      notes: notes || `Direct manual log: ${txnType.toLowerCase()}`,
      recordedBy
    };

    onAddTransaction(newTxn);
    setIsLoggedFormOpen(false);
  };

  const filteredTxns = useMemo(() => {
    return transactions
      .filter((t) => {
        const sku = skus.find((s) => s.id === t.skuId);
        const namePart = sku ? sku.name.toLowerCase() : '';
        const matchSearch = t.skuId.toLowerCase().includes(searchQuery.toLowerCase()) ||
                            namePart.includes(searchQuery.toLowerCase()) ||
                            t.notes.toLowerCase().includes(searchQuery.toLowerCase());
        const matchType = filterType === 'ALL' || t.type === filterType;
        return matchSearch && matchType;
      })
      .sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());
  }, [transactions, searchQuery, filterType, skus]);

  return (
    <div className="space-y-6">

      <div className="flex flex-col md:flex-row gap-4 justify-between items-center">

        <div className="relative w-full md:w-96">
          <span className="absolute inset-y-0 left-0 pl-3 flex items-center text-stone-400">
            <Search className="h-4 w-4" />
          </span>
          <input
            type="text"
            className="w-full pl-9 pr-4 py-2 text-stone-700 bg-white border border-stone-200 rounded-xl focus:border-amber-500 focus:ring-1 focus:ring-amber-500 text-xs outline-hidden"
            placeholder="Search transactions, notes, bill numbers..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>

        <div className="flex flex-wrap gap-2 w-full md:w-auto items-center">
          <span className="text-stone-500 text-[11px] uppercase font-mono tracking-wider mr-1">Filter by:</span>
          <button
            onClick={() => setFilterType('ALL')}
            className={`px-3 py-1.5 rounded-xl border text-xs font-semibold transition-colors ${
              filterType === 'ALL'
                ? 'bg-amber-100 text-amber-900 border-amber-200 font-bold'
                : 'bg-white border-stone-200 text-stone-600 hover:bg-stone-50'
            }`}
          >
            All Ledger
          </button>

          {txnTypes.map((txn, idx) => (
            <button
              key={idx}
              onClick={() => setFilterType(txn.type)}
              className={`px-3 py-1.5 rounded-xl border text-xs font-semibold transition-colors ${
                filterType === txn.type
                  ? 'bg-amber-100 text-amber-900 border-amber-200 font-bold'
                  : 'bg-white border-stone-200 text-stone-600 hover:bg-stone-50'
              }`}
            >
              {txn.label}
            </button>
          ))}

          <button
            onClick={handleOpenLogForm}
            className="ml-auto inline-flex items-center gap-1.5 px-4 py-2 text-xs font-bold text-white bg-amber-600 rounded-xl hover:bg-amber-700 transition-colors shadow-xs"
          >
            <Plus className="h-4 w-4" />
            Log Stock Transaction
          </button>
        </div>
      </div>

      <div className="bg-white rounded-2xl border border-stone-100 shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-stone-50 border-b border-stone-100 text-stone-500 uppercase font-mono text-[10px] tracking-wider">
                <th className="px-6 py-4">Transaction Code / Date</th>
                <th className="px-6 py-4">Associated Product SKU</th>
                <th className="px-6 py-4">Operation Type</th>
                <th className="px-6 py-4 text-center">Movement Qty</th>
                <th className="px-6 py-4">Flow Logistics</th>
                <th className="px-6 py-4">Operational Notes</th>
                <th className="px-6 py-4">Responsible User</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-stone-50 text-xs text-stone-600">
              {filteredTxns.length === 0 ? (
                <tr>
                  <td colSpan={7} className="text-center py-10 italic text-stone-400">
                    No matching stock movement logs found.
                  </td>
                </tr>
              ) : (
                filteredTxns.map((txn) => {
                  const sku = skus.find((s) => s.id === txn.skuId);
                  const isPositive = ['INWARD', 'RETURN_CUSTOMER'].includes(txn.type);
                  const isAdjustment = txn.type === 'RECONCILIATION';
                  const isDamaged = txn.type === 'OUTWARD_DAMAGED';

                  return (
                    <tr key={txn.id} className="hover:bg-amber-50/10 transition-colors">

                      <td className="px-6 py-4">
                        <div className="space-y-1">
                          <span className="font-mono text-stone-800 font-bold bg-stone-100 border border-stone-200/50 px-1.5 py-0.5 rounded text-[10px]">
                            {txn.id}
                          </span>
                          <span className="block text-[10px] text-stone-400 flex items-center gap-1 font-mono">
                            <Calendar className="h-3 w-3" />
                            {new Date(txn.timestamp).toLocaleString([], { dateStyle: 'short', timeStyle: 'short' })}
                          </span>
                        </div>
                      </td>

                      <td className="px-6 py-4">
                        <div className="space-y-0.5">
                          <span className="text-stone-800 font-semibold block">{sku ? sku.name : 'Unknown SKU'}</span>
                          <span className="font-mono text-stone-500 text-[10px]">{txn.skuId}</span>
                        </div>
                      </td>

                      <td className="px-6 py-4">
                        <span className={`inline-flex items-center px-2 py-0.5 rounded font-mono text-[9px] font-bold uppercase tracking-wider ${
                          isPositive
                            ? 'bg-emerald-100 text-emerald-800 border border-emerald-200/40'
                            : isAdjustment
                              ? 'bg-amber-100 text-amber-800 border border-amber-200/40'
                              : isDamaged
                                ? 'bg-orange-100 text-orange-800 border-orange-200/40'
                                : 'bg-rose-100/90 text-rose-800 border border-rose-200/40'
                        }`}>
                          {txn.type}
                        </span>
                      </td>

                      <td className="px-6 py-4 text-center">
                        <span className={`font-mono text-sm font-extrabold ${
                          isPositive 
                            ? 'text-emerald-600' 
                            : isAdjustment 
                              ? txn.quantity >= 0 
                                ? 'text-emerald-500' 
                                : 'text-rose-500' 
                              : 'text-rose-600'
                        }`}>
                          {isPositive ? `+${txn.quantity}` : isAdjustment ? (txn.quantity >= 0 ? `+${txn.quantity}` : `${txn.quantity}`) : `-${txn.quantity}`}
                        </span>
                      </td>

                      <td className="px-6 py-4 text-[11px] text-stone-500 max-w-[200px]">
                        <div className="flex flex-col">
                          <span className="truncate" title={txn.source}>From: {txn.source}</span>
                          <span className="truncate flex items-center gap-1 text-stone-800" title={txn.destination}>
                            <CornerDownRight className="h-3 w-3 text-stone-400" />
                            To: {txn.destination}
                          </span>
                        </div>
                      </td>

                      <td className="px-6 py-4 max-w-[200px] text-[11px] text-stone-500 block break-words">
                        <div className="flex items-start gap-1">
                          <FileText className="h-3.5 w-3.5 text-stone-300 mt-0.5 shrink-0" />
                          <span className="leading-relaxed font-sans">{txn.notes}</span>
                        </div>
                      </td>

                      <td className="px-6 py-4">
                        <span className="inline-flex items-center gap-1 text-stone-700 bg-stone-100/50 px-2 py-0.5 rounded-full text-[10px] font-medium">
                          <User className="h-3 w-3 text-stone-400" />
                          {txn.recordedBy}
                        </span>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>

      {isLoggedFormOpen && (
        <div className="fixed inset-0 bg-stone-900/40 backdrop-blur-xs flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-3xl shadow-xl border border-stone-100 w-full max-w-xl overflow-hidden">

            <div className="bg-gradient-to-r from-amber-600 to-amber-700 p-5 text-white flex justify-between items-center">
              <div>
                <h3 className="font-serif text-lg font-bold">Write Stock transaction Entry</h3>
                <p className="text-amber-100 text-[11px]">Divine Hindu Bangalore physical Counter Ledger logs</p>
              </div>
              <button 
                onClick={() => setIsLoggedFormOpen(false)}
                className="text-white hover:text-amber-200 font-bold"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleSubmittingTxn} className="p-6 space-y-4">
              {formError && (
                <div className="p-3 bg-rose-50 border border-rose-100 rounded-xl text-rose-700 text-xs font-medium">
                  {formError}
                </div>
              )}

              <div className="space-y-1">
                <label className="text-stone-600 font-medium text-xs block">Select Holy SKU / Product</label>
                <select
                  required
                  className="w-full px-3 py-1.5 text-xs text-stone-700 border border-stone-200 rounded-lg focus:outline-hidden focus:border-amber-500"
                  value={selectedSkuId}
                  onChange={(e) => setSelectedSkuId(e.target.value)}
                >
                  <option value="" disabled>-- Choose Product SKU --</option>
                  {skus.map((sku) => (
                    <option key={sku.id} value={sku.id}>
                      [{sku.id}] {sku.name} (₹{sku.price})
                    </option>
                  ))}
                </select>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">

                <div className="space-y-1">
                  <label className="text-stone-600 font-medium text-xs block">Movement Operation</label>
                  <select
                    className="w-full px-3 py-1.5 text-xs text-stone-700 border border-stone-200 rounded-lg focus:outline-hidden focus:border-amber-500"
                    value={txnType}
                    onChange={(e) => handleTypeChange(e.target.value as TransactionType)}
                  >
                    <option value="INWARD">INWARD (Receipt from warehouse or artisan)</option>
                    <option value="OUTWARD_SALE">OUTWARD_SALE (Counter cash bill checkout)</option>
                    <option value="OUTWARD_DAMAGED">OUTWARD_DAMAGED (Tarnish/dent write-off)</option>
                    <option value="RETURN_CUSTOMER">RETURN_CUSTOMER (Customer returns/exchange)</option>
                    <option value="RETURN_SUPPLIER">RETURN_SUPPLIER (Dispatch back to supplier/artisan)</option>
                  </select>
                </div>

                <div className="space-y-1">
                  <label className="text-stone-600 font-medium text-xs block">Quantity Count</label>
                  <input
                    type="number"
                    min="1"
                    required
                    className="w-full px-3 py-1.5 text-xs text-stone-700 border border-stone-200 rounded-lg focus:outline-hidden focus:border-amber-500"
                    value={quantity}
                    onChange={(e) => setQuantity(Number(e.target.value))}
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 bg-stone-50 p-3 rounded-xl border border-stone-100">
                <div className="space-y-1">
                  <span className="text-[10px] text-stone-400 block uppercase font-mono font-bold">Source point</span>
                  <input
                    type="text"
                    required
                    className="w-full px-2.5 py-1 text-xs text-stone-700 bg-white border border-stone-200 rounded-lg"
                    value={source}
                    onChange={(e) => setSource(e.target.value)}
                  />
                </div>
                <div className="space-y-1">
                  <span className="text-[10px] text-stone-400 block uppercase font-mono font-bold">Destination point</span>
                  <input
                    type="text"
                    required
                    className="w-full px-2.5 py-1 text-xs text-stone-700 bg-white border border-stone-200 rounded-lg"
                    value={destination}
                    onChange={(e) => setDestination(e.target.value)}
                  />
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-stone-600 font-medium text-xs block">Recorded By (Signature Name)</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Priya Sharma (Sales Clerk)"
                  className="w-full px-3 py-1.5 text-xs text-stone-700 border border-stone-200 rounded-lg focus:outline-hidden focus:border-amber-500"
                  value={recordedBy}
                  onChange={(e) => setRecordedBy(e.target.value)}
                />
              </div>

              <div className="space-y-1">
                <label className="text-stone-600 font-medium text-xs block">Internal Reference Notes / Explanations</label>
                <textarea
                  className="w-full px-3 py-2 text-xs text-stone-700 border border-stone-200 rounded-lg focus:outline-hidden focus:border-amber-500"
                  rows={2}
                  placeholder="Add details (e.g. Bill #DH-BGL-00045, Exchange for thali plate, damaged box inside delivery carton)"
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                />
              </div>

              <div className="pt-2 flex justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setIsLoggedFormOpen(false)}
                  className="px-4 py-2 border border-stone-200 rounded-xl text-stone-600 text-xs hover:bg-stone-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 text-xs font-bold text-white bg-amber-600 rounded-xl hover:bg-amber-700 shadow-sm"
                >
                  Verify & Log Entry
                </button>
              </div>

            </form>
          </div>
        </div>
      )}

    </div>
  );
}
