
import React, { useState, useMemo, useEffect } from 'react';
import { SKU, InventoryTransaction, StockReconciliation } from './types';
import { 
  getStoredSKUs, 
  saveSKUs, 
  getStoredTransactions, 
  saveTransactions, 
  getStoredAudits, 
  saveAudits,
  calculateCurrentStock
} from './utils/storage';

import LiveDashboard from './components/LiveDashboard';
import SKUManagement from './components/SKUManagement';
import TransactionsLedger from './components/TransactionsLedger';
import StockReconciliationComponent from './components/StockReconciliation';
import OperationalGuidebook from './components/OperationalGuidebook';
import DivineHinduLogo from './components/DivineHinduLogo';

import { 
  Compass, 
  LayoutDashboard, 
  Tag, 
  Briefcase, 
  RotateCw, 
  CheckSquare, 
  Sparkles, 
  MapPin, 
  Bell, 
  ShieldCheck,
  Package,
  Calculator,
  History
} from 'lucide-react';

export default function App() {
  const [activeTab, setActiveTab] = useState<string>('dashboard');

  const [skus, setSkus] = useState<SKU[]>(() => getStoredSKUs());
  const [transactions, setTransactions] = useState<InventoryTransaction[]>(() => getStoredTransactions());
  const [audits, setAudits] = useState<StockReconciliation[]>(() => getStoredAudits());
  const [locationName, setLocationName] = useState<string>('Locating store...');

  useEffect(() => {
    if ('geolocation' in navigator) {
      navigator.geolocation.getCurrentPosition(
        async (position) => {
          try {
            const { latitude, longitude } = position.coords;
            const response = await fetch(`https://api.bigdatacloud.net/data/reverse-geocode-client?latitude=${latitude}&longitude=${longitude}&localityLanguage=en`);
            if (response.ok) {
              const data = await response.json();
              const city = data.city || data.locality || data.principalSubdivision || 'Local';
              setLocationName(`${city} store`);
            } else {
              setLocationName('Location unknown');
            }
          } catch (error) {
            console.error("Error fetching location:", error);
            setLocationName('Dynamic store');
          }
        },
        (error) => {
          console.error("Geolocation error:", error);
          setLocationName('Bangalore store');
        }
      );
    } else {
      setLocationName('Bangalore store');
    }
  }, []);

  const lowStockCount = useMemo(() => {
    return skus.filter(s => {
      const curStock = calculateCurrentStock(s, transactions);
      return curStock <= s.minStockAlert;
    }).length;
  }, [skus, transactions]);

  const handleAddSKU = (newSku: SKU) => {
    const updated = [...skus, newSku];
    setSkus(updated);
    saveSKUs(updated);
  };

  const handleEditSKU = (editedSku: SKU) => {
    const updated = skus.map(s => s.id === editedSku.id ? editedSku : s);
    setSkus(updated);
    saveSKUs(updated);
  };

  const handleDeleteSKU = (id: string) => {
    const updated = skus.filter(s => s.id !== id);
    setSkus(updated);
    saveSKUs(updated);
  };

  const handleAddTransaction = (newTxn: InventoryTransaction) => {
    const updated = [...transactions, newTxn];
    setTransactions(updated);
    saveTransactions(updated);
  };

  const handleAddAudit = (newAudit: StockReconciliation, adjustmentTransactions: InventoryTransaction[]) => {
    const updatedAudits = [newAudit, ...audits];
    setAudits(updatedAudits);
    saveAudits(updatedAudits);

    if (adjustmentTransactions.length > 0) {
      const updatedTxns = [...transactions, ...adjustmentTransactions];
      setTransactions(updatedTxns);
      saveTransactions(updatedTxns);
    }
  };

  const handleQuickNavigate = (tab: string) => {
    setActiveTab(tab);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="min-h-screen bg-stone-50 text-stone-800 flex flex-col font-sans selection:bg-amber-100 selection:text-amber-900">

      <header className="bg-white border-b border-stone-200 sticky top-0 z-40 shadow-2xs">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3">
          <div className="flex justify-between items-center min-h-[60px]">

            <div className="flex items-center gap-5">
              <DivineHinduLogo />
              <div className="hidden sm:flex flex-col justify-center border-l border-stone-200 pl-5 h-10">
                <div className="flex items-center gap-2">
                  <span className="text-[10px] font-mono font-bold text-amber-800 bg-amber-50 px-1.5 py-0.5 rounded border border-amber-200 line-clamp-1">
                    SOP SYSTEM
                  </span>
                </div>
                <p className="text-[10px] font-mono uppercase tracking-wider text-stone-500 flex items-center gap-1 mt-1 truncate">
                  <MapPin className="h-3 w-3 text-amber-600 shrink-0" />
                  {locationName}
                </p>
              </div>
            </div>

            <div className="hidden md:flex items-center gap-6">
              {lowStockCount > 0 ? (
                <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-rose-50 border border-rose-100 text-rose-700 text-xs font-semibold animate-pulse">
                  <Bell className="h-3.5 w-3.5" />
                  <span>{lowStockCount} Low stock warnings</span>
                </div>
              ) : (
                <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-emerald-50 border border-emerald-100 text-emerald-800 text-xs font-semibold">
                  <ShieldCheck className="h-3.5 w-3.5 text-emerald-600" />
                  <span>Ledger in check</span>
                </div>
              )}

              <div className="text-right">
                <span className="block text-[9px] uppercase font-mono text-stone-500 font-semibold">Local Clock</span>
                <span className="block text-xs font-medium text-stone-700 font-mono">2026-06-20 (Sat)</span>
              </div>
            </div>

          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 flex-1 flex flex-col gap-8 w-full">

        <div className="bg-white p-2 rounded-2xl border border-stone-200 shadow-3xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">

          <nav className="flex flex-wrap gap-1" aria-label="Tabs font-semibold">

            <button
              onClick={() => setActiveTab('dashboard')}
              className={`inline-flex items-center gap-2 px-4 py-2.5 text-xs font-bold rounded-xl transition-all ${
                activeTab === 'dashboard'
                  ? 'bg-amber-600 text-white shadow-xs'
                  : 'text-stone-600 hover:text-stone-950 hover:bg-stone-50'
              }`}
            >
              <LayoutDashboard className="h-4 w-4 shrink-0" />
              Live Dashboard
            </button>

            <button
              onClick={() => setActiveTab('catalog')}
              className={`inline-flex items-center gap-2 px-4 py-2.5 text-xs font-bold rounded-xl transition-all ${
                activeTab === 'catalog'
                  ? 'bg-amber-600 text-white shadow-xs'
                  : 'text-stone-600 hover:text-stone-950 hover:bg-stone-50'
              }`}
            >
              <Tag className="h-4 w-4 shrink-0" />
              SKU Registry
            </button>

            <button
              onClick={() => setActiveTab('ledger')}
              className={`inline-flex items-center gap-2 px-4 py-2.5 text-xs font-bold rounded-xl transition-all ${
                activeTab === 'ledger'
                  ? 'bg-amber-600 text-white shadow-xs'
                  : 'text-stone-600 hover:text-stone-950 hover:bg-stone-50'
              }`}
            >
              <History className="h-4 w-4 shrink-0" />
              Inward/Outward Ledger
            </button>

            <button
              onClick={() => setActiveTab('audit')}
              className={`inline-flex items-center gap-2 px-4 py-2.5 text-xs font-bold rounded-xl transition-all ${
                activeTab === 'audit'
                  ? 'bg-amber-600 text-white shadow-xs'
                  : 'text-stone-600 hover:text-stone-950 hover:bg-stone-50'
              }`}
            >
              <Calculator className="h-4 w-4 shrink-0" />
              Manual Stock Audit
            </button>

            <button
              onClick={() => setActiveTab('strategy')}
              className={`inline-flex items-center gap-2 px-4 py-2.5 text-xs font-bold rounded-xl transition-all relative ${
                activeTab === 'strategy'
                  ? 'bg-amber-600 text-white shadow-xs'
                  : 'text-stone-600 hover:text-stone-950 hover:bg-stone-50'
              }`}
            >
              <Briefcase className="h-4 w-4 shrink-0" />
              Local SOP Blueprint
              <span className="absolute -top-1 -right-1 bg-rose-600 text-white text-[8px] font-bold h-4 w-4 rounded-full flex items-center justify-center animate-pulse shadow-xs">
                SOP
              </span>
            </button>

          </nav>

          <div className="flex items-center gap-2 text-xs font-mono text-stone-500 px-3 self-end sm:self-auto">
            <span>Logged: <strong>{transactions.length}</strong> movements</span>
          </div>

        </div>

        <main className="flex-1">
          {activeTab === 'dashboard' && (
            <LiveDashboard 
              skus={skus} 
              transactions={transactions} 
              onNavigate={handleQuickNavigate} 
            />
          )}

          {activeTab === 'catalog' && (
            <SKUManagement 
              skus={skus} 
              transactions={transactions} 
              onAddSKU={handleAddSKU}
              onEditSKU={handleEditSKU}
              onDeleteSKU={handleDeleteSKU}
            />
          )}

          {activeTab === 'ledger' && (
            <TransactionsLedger 
              transactions={transactions} 
              skus={skus} 
              onAddTransaction={handleAddTransaction}
            />
          )}

          {activeTab === 'audit' && (
            <StockReconciliationComponent 
              skus={skus} 
              transactions={transactions} 
              pastAudits={audits}
              onAddAudit={handleAddAudit}
            />
          )}

          {activeTab === 'strategy' && (
            <OperationalGuidebook />
          )}
        </main>

      </div>

      <footer className="bg-white border-t border-stone-200 mt-auto">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 flex flex-col md:flex-row justify-between items-center text-xs text-stone-500 gap-4">
          <div className="flex gap-2 items-center">
            <Sparkles className="h-4 w-4 text-amber-500" />
            <span>Divine Hindu {locationName} • Inventory Tracking Desk</span>
          </div>
          <div className="flex gap-4 font-mono select-none">
            <span>Environment: React 19 + Tailwind v4</span>
            <span>•</span>
            <span>SOP Reference: DH-BGL-2026</span>
          </div>
        </div>
      </footer>

    </div>
  );
}
