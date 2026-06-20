
import React, { useMemo } from 'react';
import { SKU, InventoryTransaction } from '../types';
import { calculateCurrentStock } from '../utils/storage';
import { 
  ShieldAlert, 
  TrendingUp, 
  Package, 
  Boxes, 
  DollarSign, 
  AlertTriangle, 
  History, 
  ArrowUpRight, 
  ArrowDownRight,
  Sparkles,
  MapPin,
  FlameKindling
} from 'lucide-react';
import { motion } from 'motion/react';

interface LiveDashboardProps {
  skus: SKU[];
  transactions: InventoryTransaction[];
  onNavigate: (tab: string) => void;
}

export default function LiveDashboard({ skus, transactions, onNavigate }: LiveDashboardProps) {

  const skuMetrics = useMemo(() => {
    let totalStock = 0;
    let totalMRPValuation = 0;
    let totalCostValuation = 0;
    let lowStockCount = 0;
    const itemsWithCurrentStock = skus.map(s => {
      const curStock = calculateCurrentStock(s, transactions);
      const isLow = curStock <= s.minStockAlert;
      if (isLow) lowStockCount++;
      totalStock += curStock;
      totalMRPValuation += curStock * s.price;
      totalCostValuation += curStock * s.costPrice;
      return { ...s, currentStock: curStock, isLow };
    });

    return {
      totalStock,
      totalMRPValuation,
      totalCostValuation,
      lowStockCount,
      items: itemsWithCurrentStock
    };
  }, [skus, transactions]);

  const categoryMetrics = useMemo(() => {
    const categories: Record<string, { count: number; value: number; stock: number }> = {};
    skuMetrics.items.forEach(item => {
      if (!categories[item.category]) {
        categories[item.category] = { count: 0, value: 0, stock: 0 };
      }
      categories[item.category].count += 1;
      categories[item.category].stock += item.currentStock;
      categories[item.category].value += item.currentStock * item.price;
    });

    return Object.entries(categories).map(([k, v]) => ({
      name: k,
      ...v
    }));
  }, [skuMetrics]);

  const recentTransactions = useMemo(() => {
    return [...transactions]
      .sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime())
      .slice(0, 5);
  }, [transactions]);

  const formatINR = (value: number) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0
    }).format(value);
  };

  return (
    <div className="space-y-8">

      <div className="relative rounded-3xl overflow-hidden bg-gradient-to-tr from-amber-50 to-orange-50/70 border border-orange-100 p-6 md:p-8 flex flex-col md:flex-row shadow-sm gap-6 justify-between items-start md:items-center">
        <div className="space-y-2">
          <div className="flex items-center gap-2 text-rose-600 font-medium text-sm tracking-wider uppercase font-sans">
            <Sparkles className="h-4 w-4 animate-pulse text-amber-500" />
            <span>Bangalore HQ • Divine Hindu Store #1</span>
          </div>
          <h2 className="font-serif text-3xl font-semibold tracking-tight text-amber-900">
            Sacred Inventory Control
          </h2>
          <p className="text-stone-600 max-w-2xl text-sm leading-relaxed">
            Welcome to the spiritual retail front. Track traditional hand-crafted brass deities, sacred incense supplies, and temple accessories with direct stock reconciliation, returns logs, and automated low-stock warnings.
          </p>
        </div>
        <div className="flex flex-row gap-3 bg-white p-4 rounded-2xl border border-orange-100/50 shadow-xs self-stretch md:self-auto justify-around">
          <div className="text-center px-4">
            <span className="block text-xs text-stone-500 uppercase font-medium">BGL Store status</span>
            <span className="flex items-center gap-2 justify-center font-serif text-lg font-bold text-teal-600 mt-1">
              <span className="h-2 w-2 rounded-full bg-teal-500 animate-ping"></span>
              Live Counters
            </span>
          </div>
          <div className="border-l border-stone-200"></div>
          <div className="text-center px-4">
            <span className="block text-xs text-stone-500 uppercase font-medium">Alert Thresholds</span>
            <span className="block font-serif text-lg font-bold text-rose-600 mt-1">
              {skuMetrics.lowStockCount > 0 ? `${skuMetrics.lowStockCount} Critical` : 'All Healthy'}
            </span>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">

        <div className="bg-white p-6 rounded-2xl border border-stone-100 shadow-xs flex items-center justify-between gap-4">
          <div className="space-y-1">
            <span className="text-xs font-semibold uppercase tracking-wider text-stone-500">Active SKUs</span>
            <h3 className="font-serif text-3xl font-bold text-stone-800">{skus.length}</h3>
            <p className="text-xs text-emerald-600 font-medium flex items-center gap-1">
              <span>5 Categories Covered</span>
            </p>
          </div>
          <div className="p-3.5 bg-amber-50 rounded-xl text-amber-600">
            <Package className="h-6 w-6" />
          </div>
        </div>

        <div className="bg-white p-6 rounded-2xl border border-stone-100 shadow-xs flex items-center justify-between gap-4">
          <div className="space-y-1">
            <span className="text-xs font-semibold uppercase tracking-wider text-stone-500">Total Stock Count</span>
            <h3 className="font-serif text-3xl font-bold text-stone-800">{skuMetrics.totalStock}</h3>
            <p className="text-xs text-stone-600 flex items-center gap-1 font-medium">
              <span>Estimated items on shelf/box</span>
            </p>
          </div>
          <div className="p-3.5 bg-rose-50 rounded-xl text-rose-600">
            <Boxes className="h-6 w-6" />
          </div>
        </div>

        <div className="bg-white p-6 rounded-2xl border border-stone-100 shadow-xs flex items-center justify-between gap-4">
          <div className="space-y-1">
            <span className="text-xs font-semibold uppercase tracking-wider text-stone-500">Retail Value (MRP)</span>
            <h3 className="font-serif text-2xl lg:text-3xl font-bold text-teal-800">
              {formatINR(skuMetrics.totalMRPValuation)}
            </h3>
            <p className="text-xs text-stone-600 flex items-center gap-1 font-medium">
              <span>Landing Cost: {formatINR(skuMetrics.totalCostValuation)}</span>
            </p>
          </div>
          <div className="p-3.5 bg-teal-50 rounded-xl text-teal-600">
            <DollarSign className="h-6 w-6" />
          </div>
        </div>

        <div className={`p-6 rounded-2xl border transition-colors shadow-xs flex items-center justify-between gap-4 ${
          skuMetrics.lowStockCount > 0 
            ? 'bg-rose-50/60 border-rose-100' 
            : 'bg-white border-stone-100'
        }`}>
          <div className="space-y-1">
            <span className="text-xs font-semibold uppercase tracking-wider text-stone-500">Low Stock Reorders</span>
            <h3 className={`font-serif text-3xl font-bold ${
              skuMetrics.lowStockCount > 0 ? 'text-rose-700' : 'text-stone-800'
            }`}>
              {skuMetrics.lowStockCount}
            </h3>
            <p className="text-xs font-medium text-stone-600">
              {skuMetrics.lowStockCount > 0 ? 'Action required soon' : 'All items well stock'}
            </p>
          </div>
          <div className={`p-3.5 rounded-xl ${
            skuMetrics.lowStockCount > 0 ? 'bg-rose-100 text-rose-700' : 'bg-stone-50 text-stone-500'
          }`}>
            <AlertTriangle className="h-6 w-6 animate-pulse" />
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

        <div className="bg-white p-6 rounded-2xl border border-stone-100 shadow-xs space-y-6 lg:col-span-2">
          <div className="flex justify-between items-center border-b border-stone-100 pb-4">
            <div className="space-y-1">
              <h3 className="font-serif text-lg font-bold text-stone-800">Category-wise Stock Valuation</h3>
              <p className="text-xs text-stone-500">Real-time valuation based on prices and stock logs</p>
            </div>
          </div>

          <div className="space-y-4">
            {categoryMetrics.map((cat, idx) => {

              const maxValue = Math.max(...categoryMetrics.map(c => c.value), 1);
              const percentage = (cat.value / maxValue) * 100;

              return (
                <div key={idx} className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="font-medium text-stone-700">{cat.name}</span>
                    <div className="space-x-2 text-xs">
                      <span className="text-stone-500">Vol: {cat.stock} items</span>
                      <span className="font-bold text-stone-800">{formatINR(cat.value)}</span>
                    </div>
                  </div>

                  <div className="h-3.5 w-full bg-stone-50 rounded-full overflow-hidden border border-stone-100">
                    <motion.div 
                      key={cat.value}
                      className="h-full bg-gradient-to-r from-amber-500 to-rose-600 rounded-full"
                      initial={{ width: 0 }}
                      animate={{ width: `${percentage}%` }}
                      transition={{ duration: 0.8, ease: 'easeOut' }}
                    />
                  </div>
                </div>
              );
            })}
          </div>

          <div className="rounded-xl bg-amber-50 border border-amber-100 p-4 flex gap-3 items-start">
            <ShieldAlert className="h-5 w-5 text-amber-600 shrink-0 mt-0.5" />
            <div className="text-xs space-y-1">
              <span className="font-bold text-amber-900 block">SOP Notice: Bangalore Store First-Launch Verification</span>
              <p className="text-amber-700 leading-relaxed">
                Ensure all incoming stocks have physical QR/barcode sticker printed at the warehouse desk. If items arrive damaged from rural artisans, put them directly in the <strong>Quarantine Damaged Bin</strong> and record a <em>RETURN_SUPPLIER</em> transaction here.
              </p>
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-2xl border border-stone-100 shadow-xs space-y-6 flex flex-col">
          <div className="flex justify-between items-center border-b border-stone-100 pb-4">
            <div className="space-y-1">
              <h3 className="font-serif text-lg font-bold text-stone-800 flex items-center gap-2">
                <History className="h-5 w-5 text-rose-500" />
                Live Stock Logs
              </h3>
              <p className="text-xs text-stone-500">Latest operations recorded today</p>
            </div>
          </div>

          <div className="flex-1 space-y-4">
            {recentTransactions.length === 0 ? (
              <p className="text-stone-400 text-xs italic text-center py-8">No transactions logged yet.</p>
            ) : (
              recentTransactions.map((txn, idx) => {
                const sku = skus.find(s => s.id === txn.skuId);
                const isPositive = ['INWARD', 'RETURN_CUSTOMER'].includes(txn.type);
                const isDamaged = txn.type === 'OUTWARD_DAMAGED';

                return (
                  <div key={idx} className="flex gap-3 text-xs border-b border-stone-50 pb-3 last:border-b-0 items-start">
                    <div className={`p-2 rounded-lg shrink-0 ${
                      isPositive 
                        ? 'bg-emerald-50 text-emerald-700' 
                        : isDamaged 
                          ? 'bg-amber-50 text-amber-700' 
                          : 'bg-rose-50 text-rose-700'
                    }`}>
                      {isPositive ? (
                        <ArrowUpRight className="h-3.5 w-3.5" />
                      ) : (
                        <ArrowDownRight className="h-3.5 w-3.5" />
                      )}
                    </div>
                    <div className="flex-1 min-w-0 space-y-1">
                      <div className="flex justify-between items-center">
                        <span className="font-semibold text-stone-800 truncate block max-w-[130px]">
                          {sku ? sku.name : txn.skuId}
                        </span>
                        <span className={`px-1.5 py-0.5 rounded font-mono text-[9px] uppercase font-bold ${
                          isPositive 
                            ? 'bg-emerald-100 text-emerald-800' 
                            : isDamaged 
                              ? 'bg-amber-100 text-amber-800' 
                              : 'bg-rose-100/90 text-rose-800'
                        }`}>
                          {txn.type}
                        </span>
                      </div>
                      <p className="text-stone-500 font-mono text-[10px]">Qty: {txn.quantity} • {txn.notes}</p>
                      <p className="text-stone-400 text-[9px]">{new Date(txn.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })} • {txn.recordedBy.split(' ')[0]}</p>
                    </div>
                  </div>
                );
              })
            )}
          </div>

          <button 
            onClick={() => onNavigate('ledger')}
            className="w-full text-center py-2.5 text-xs font-semibold text-amber-700 bg-amber-50 rounded-xl hover:bg-amber-100 border border-amber-100 transition-colors"
          >
            Open Transaction Ledger
          </button>
        </div>

      </div>

      <div className="bg-white p-6 rounded-2xl border border-stone-100 shadow-xs space-y-4">
        <div>
          <h3 className="font-serif text-lg font-bold text-stone-800 flex items-center gap-2">
            <FlameKindling className="h-5 w-5 text-amber-500" />
            Active Low Stock Warnings
          </h3>
          <p className="text-xs text-stone-500">Items below recommended minimum shelf levels (automatic alert calculation)</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {skuMetrics.items.filter(item => item.isLow).map((item, idx) => (
            <div key={idx} className="p-4 rounded-xl bg-orange-50/50 border border-orange-100 flex justify-between items-center gap-3">
              <div className="space-y-1">
                <span className="text-[10px] font-mono font-bold text-orange-700 bg-orange-100 px-2 py-0.5 rounded-full uppercase">
                  {item.category}
                </span>
                <h4 className="font-medium text-stone-800 text-sm">{item.name}</h4>
                <p className="text-xs text-stone-500">SKU: {item.id}</p>
              </div>
              <div className="text-right">
                <span className="block text-xs text-stone-500">Current Stock</span>
                <span className="block font-mono text-lg font-bold text-rose-600 bg-white border border-rose-100 rounded-lg px-2 py-1 mt-0.5 text-center shadow-xs">
                  {item.currentStock} / <span className="text-stone-400 text-xs">{item.minStockAlert}</span>
                </span>
              </div>
            </div>
          ))}

          {skuMetrics.items.filter(item => item.isLow).length === 0 && (
            <div className="p-8 text-center bg-stone-50 rounded-xl border border-dashed border-stone-200 col-span-2 text-stone-500 text-xs">
              Excellent! No low-stock alerts triggered. All Bangalore store items are sufficiently supplied.
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
