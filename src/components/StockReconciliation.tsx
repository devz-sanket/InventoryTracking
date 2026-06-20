
import React, { useState, useMemo } from 'react';
import { SKU, InventoryTransaction, StockReconciliation } from '../types';
import { calculateCurrentStock } from '../utils/storage';
import { 
  ClipboardCheck, 
  HelpCircle, 
  AlertTriangle, 
  CheckCircle, 
  Plus, 
  Trash, 
  TrendingUp, 
  ArrowRight,
  Calculator,
  RotateCcw,
  BookOpenCheck
} from 'lucide-react';

interface StockReconciliationProps {
  skus: SKU[];
  transactions: InventoryTransaction[];
  pastAudits: StockReconciliation[];
  onAddAudit: (audit: StockReconciliation, adjustmentTransactions: InventoryTransaction[]) => void;
}

export default function StockReconciliationComponent({ 
  skus, 
  transactions, 
  pastAudits, 
  onAddAudit 
}: StockReconciliationProps) {

  const [physicalCounts, setPhysicalCounts] = useState<Record<string, number>>({});
  const [auditNotes, setAuditNotes] = useState('');
  const [auditorName, setAuditorName] = useState('');
  const [auditErrors, setAuditErrors] = useState('');
  const [successMsg, setSuccessMsg] = useState('');

  const systemQuantities = useMemo(() => {
    const qtys: Record<string, number> = {};
    skus.forEach(s => {
      qtys[s.id] = calculateCurrentStock(s, transactions);
    });
    return qtys;
  }, [skus, transactions]);

  const handlePhysicalCountChange = (skuId: string, value: string) => {
    const val = value === '' ? 0 : Math.max(0, parseInt(value, 10));
    setPhysicalCounts(prev => ({
      ...prev,
      [skuId]: val
    }));
  };

  const handleResetToSystem = () => {
    const defaults: Record<string, number> = {};
    skus.forEach(s => {
      defaults[s.id] = systemQuantities[s.id];
    });
    setPhysicalCounts(defaults);
    setSuccessMsg('');
    setAuditErrors('');
  };

  React.useEffect(() => {
    if (Object.keys(physicalCounts).length === 0 && skus.length > 0) {
      handleResetToSystem();
    }
  }, [skus, systemQuantities]);

  const liveAuditCalculations = useMemo(() => {
    let surplusCount = 0;
    let deficitCount = 0;
    let perfectCount = 0;
    let netFinancialImpact = 0; 

    const items = skus.map(s => {
      const systemQty = systemQuantities[s.id] || 0;
      const physicalQty = physicalCounts[s.id] !== undefined ? physicalCounts[s.id] : systemQty;
      const discrepancy = physicalQty - systemQty;
      const costValuation = discrepancy * s.costPrice;

      if (discrepancy > 0) {
        surplusCount++;
      } else if (discrepancy < 0) {
        deficitCount++;
      } else {
        perfectCount++;
      }

      netFinancialImpact += costValuation;

      return {
        sku: s,
        systemQty,
        physicalQty,
        discrepancy,
        financialImpact: costValuation
      };
    });

    return {
      items,
      surplusCount,
      deficitCount,
      perfectCount,
      netFinancialImpact
    };
  }, [skus, systemQuantities, physicalCounts]);

  const handleCommitAudit = (e: React.FormEvent) => {
    e.preventDefault();
    setAuditErrors('');
    setSuccessMsg('');

    if (!auditorName.trim()) {
      setAuditErrors('Please enter the name of the Auditor / Store Manager.');
      return;
    }

    const auditId = `AUD-${Math.floor(200 + Math.random() * 800)}`;
    const timestamp = new Date().toISOString();

    const auditItemsList = liveAuditCalculations.items.map(item => ({
      skuId: item.sku.id,
      systemQty: item.systemQty,
      physicalQty: item.physicalQty,
      mismatchQty: item.discrepancy,
      resolved: true,
      resolutionNotes: item.discrepancy !== 0 
        ? `Manual counted stock of ${item.physicalQty} replaces system stock of ${item.systemQty}. Adjusted.` 
        : 'Aligned perfectly'
    }));

    const adjustmentTxns: InventoryTransaction[] = [];
    liveAuditCalculations.items.forEach(item => {
      if (item.discrepancy !== 0) {
        adjustmentTxns.push({
          id: `TXN-REC-${Math.floor(1000 + Math.random() * 9000)}`,
          skuId: item.sku.id,
          type: 'RECONCILIATION',
          quantity: Math.abs(item.discrepancy), 
          timestamp,
          source: 'Audited Physical Count Check',
          destination: item.discrepancy > 0 ? 'Store Shelf (Audit Surplus Supplement)' : 'Write-Off Quarantine (Deficit Loss Adjustment)',
          notes: `[AUDIT RECONCILIATION ${auditId}] Resolved discrepancy of ${item.discrepancy > 0 ? '+' : ''}${item.discrepancy} items. Adjusted system record to match verified physical shelves.`,
          recordedBy: auditorName
        });
      }
    });

    const newAudit: StockReconciliation = {
      id: auditId,
      timestamp,
      recordedBy: auditorName,
      notes: auditNotes || 'Routine physical stock reconciliation cycle count.',
      items: auditItemsList
    };

    onAddAudit(newAudit, adjustmentTxns);

    setSuccessMsg(`Succesfully commited Audit ${auditId}! Generated and posted ${adjustmentTxns.length} stock ledger corrections.`);
    setAuditNotes('');
    setAuditorName('');

    setPhysicalCounts({});
  };

  return (
    <div className="space-y-6">

      <div className="bg-stone-50 border border-stone-200 rounded-2xl p-5 flex flex-col md:flex-row gap-5 justify-between items-start md:items-center">
        <div className="space-y-1.5 max-w-2xl">
          <span className="flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wider text-amber-700 font-mono">
            <ClipboardCheck className="h-4 w-4" />
            Stock count & Aligned Ledger Reconciler
          </span>
          <h3 className="font-serif text-lg font-bold text-stone-800">
            Audit Checklist & Mismatch Resolution Desk
          </h3>
          <p className="text-stone-600 text-xs leading-relaxed">
            Avoid inventory inflation. Physically count items in Divine Hindu's Bangalore store, input actual counts below, and pinpoint deficits. Submitting reconciliation automatically calculates the deficit, saves the report, and posts corrections to make system stock match physical store shelves perfectly.
          </p>
        </div>

        <div className="flex gap-2 shrink-0">
          <button
            onClick={handleResetToSystem}
            className="inline-flex items-center gap-1 px-3.5 py-2 text-xs font-bold border border-amber-200 text-amber-950 bg-amber-50 rounded-xl hover:bg-amber-100 transition-colors"
          >
            <RotateCcw className="h-3.5 w-3.5" />
            Set System Defaults
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

        <div className="bg-white rounded-2xl border border-stone-100 shadow-xs p-6 lg:col-span-2 space-y-6">
          <div className="flex justify-between items-center border-b border-stone-100 pb-3">
            <h4 className="font-serif font-bold text-stone-800 text-base">Physical Stock counts Entry</h4>
            <span className="text-[11px] text-stone-400 font-mono">Counted list: {skus.length} items registered</span>
          </div>

          <div className="space-y-4 max-h-[480px] overflow-y-auto pr-2 divide-y divide-stone-50">
            {liveAuditCalculations.items.map((item, idx) => {
              const hasMismatch = item.discrepancy !== 0;

              return (
                <div key={item.sku.id} className={`pt-4 first:pt-0 pb-4 flex flex-col md:flex-row md:items-center justify-between gap-4 ${
                  hasMismatch ? 'bg-amber-50/20 px-3 rounded-lg border border-amber-50/50' : ''
                }`}>

                  <div className="space-y-1 max-w-sm">
                    <span className="font-mono text-[9px] font-bold text-stone-500 bg-stone-100 px-1.5 py-0.5 rounded uppercase">
                      {item.sku.id}
                    </span>
                    <span className="block font-medium text-stone-800 text-sm leading-tight">
                      {item.sku.name}
                    </span>
                    <span className="block text-[10px] text-stone-400">Category: {item.sku.category}</span>
                  </div>

                  <div className="flex items-center gap-6 justify-between md:justify-end">

                    <div className="text-center px-2">
                      <span className="block text-[10px] uppercase font-mono text-stone-500 font-semibold">Active Ledger</span>
                      <span className="block font-mono text-stone-800 font-bold text-sm bg-stone-50 px-2.5 py-1 rounded border border-stone-200/50 mt-1">
                        {item.systemQty}
                      </span>
                    </div>

                    <p className="text-stone-300 font-semibold text-lg">→</p>

                    <div className="text-center">
                      <span className="block text-[10px] uppercase font-mono text-stone-600 font-bold">Physical Counted</span>
                      <input
                        type="number"
                        min="0"
                        className="w-18 px-1.5 py-1 text-center font-mono font-bold text-stone-900 bg-white border border-stone-300 rounded focus:outline-hidden focus:border-amber-500 focus:ring-1 focus:ring-amber-500 mt-1"
                        value={physicalCounts[item.sku.id] !== undefined ? physicalCounts[item.sku.id] : item.systemQty}
                        onChange={(e) => handlePhysicalCountChange(item.sku.id, e.target.value)}
                      />
                    </div>

                    <div className="text-center px-2 min-w-[70px]">
                      <span className="block text-[10px] uppercase font-mono text-stone-500 font-semibold">Discrepancy</span>
                      <span className={`block font-mono font-extrabold text-sm mt-1.5 ${
                        item.discrepancy === 0 
                          ? 'text-emerald-600' 
                          : item.discrepancy > 0 
                            ? 'text-teal-600 font-extrabold' 
                            : 'text-rose-600 font-bold'
                      }`}>
                        {item.discrepancy === 0 ? 'Aligned' : item.discrepancy > 0 ? `+${item.discrepancy} (Surplus)` : `${item.discrepancy} (Deficit)`}
                      </span>
                    </div>

                  </div>
                </div>
              );
            })}
          </div>
        </div>

        <div className="space-y-6">

          <div className="bg-white p-6 rounded-2xl border border-stone-100 shadow-xs space-y-4">
            <h4 className="font-serif font-bold text-stone-800 text-sm border-b border-stone-100 pb-2">
              Audit Findings & Valuation Impact
            </h4>

            <div className="grid grid-cols-2 gap-3 text-xs">
              <div className="bg-stone-50 p-3 rounded-xl space-y-1">
                <span className="text-stone-500 block uppercase font-mono text-[9px] font-bold">Matched SKUs</span>
                <span className="block font-serif text-lg font-bold text-emerald-600">
                  {liveAuditCalculations.perfectCount}
                </span>
              </div>
              <div className="bg-stone-50 p-3 rounded-xl space-y-1">
                <span className="text-stone-500 block uppercase font-mono text-[9px] font-bold">Mismatches Found</span>
                <span className="block font-serif text-lg font-bold text-rose-600">
                  {liveAuditCalculations.surplusCount + liveAuditCalculations.deficitCount}
                </span>
              </div>
            </div>

            <div className="p-4 rounded-xl border space-y-1 text-center bg-stone-50 border-stone-100">
              <span className="text-stone-500 uppercase font-mono text-[10px] font-bold block">
                Net Discrepancy Financial Valuation (Landing Cost)
              </span>
              <span className={`font-serif text-xl font-black block ${
                liveAuditCalculations.netFinancialImpact === 0
                  ? 'text-stone-700'
                  : liveAuditCalculations.netFinancialImpact > 0
                    ? 'text-emerald-700'
                    : 'text-rose-700'
              }`}>
                {liveAuditCalculations.netFinancialImpact >= 0 ? '+' : ''}
                {liveAuditCalculations.netFinancialImpact.toLocaleString('en-IN', { style: 'currency', currency: 'INR', maximumFractionDigits: 0 })}
              </span>
              <p className="text-[10px] text-stone-400">
                Calculated purely from purchase/cost price values.
              </p>
            </div>

            {liveAuditCalculations.netFinancialImpact < 0 && (
              <div className="p-3 bg-rose-50 rounded-xl border border-rose-100 flex gap-2 items-start text-[11px] text-rose-700">
                <AlertTriangle className="h-4 w-4 shrink-0 text-rose-600 mt-0.5 animate-bounce" />
                <p>
                  Deficit shortage detected. Posting this audit will write off these financial deficits instantly and align real life store shelving.
                </p>
              </div>
            )}
          </div>

          <div className="bg-white p-6 rounded-2xl border border-stone-100 shadow-xs">
            <form onSubmit={handleCommitAudit} className="space-y-4">
              <h4 className="font-serif font-bold text-stone-800 text-sm border-b border-stone-100 pb-2 flex items-center gap-1.5">
                <Calculator className="h-4 w-4 text-amber-600" />
                Approve & Correct Ledger
              </h4>

              {auditErrors && (
                <div className="p-3 bg-rose-50 border border-rose-100 rounded-xl text-rose-700 text-xs">
                  {auditErrors}
                </div>
              )}

              {successMsg && (
                <div className="p-3 bg-emerald-50 border border-emerald-100 rounded-xl text-emerald-800 text-xs font-semibold flex items-center gap-1.5 animate-pulse">
                  <CheckCircle className="h-4 w-4 shrink-0 text-emerald-600" />
                  <p>{successMsg}</p>
                </div>
              )}

              <div className="space-y-1">
                <label className="text-stone-600 font-medium text-xs block">Lead Auditor / Store Manager Signature</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Anand Rao (Store Lead)"
                  className="w-full px-3 py-1.5 text-xs text-stone-700 border border-stone-200 rounded-lg focus:outline-hidden focus:ring-1 focus:ring-amber-500"
                  value={auditorName}
                  onChange={(e) => setAuditorName(e.target.value)}
                />
              </div>

              <div className="space-y-1">
                <label className="text-stone-600 font-medium text-xs block">Audit Scope / Remedial Action notes</label>
                <textarea
                  className="w-full px-3 py-2 text-xs text-stone-700 border border-stone-200 rounded-lg focus:outline-hidden focus:ring-1 focus:ring-amber-500"
                  rows={3}
                  placeholder="Explain mismatch causes... e.g., 'Sambrani cup dented during cleaning, Hanuman committee bulk count recount adjustment.'"
                  value={auditNotes}
                  onChange={(e) => setAuditNotes(e.target.value)}
                />
              </div>

              <button
                type="submit"
                className="w-full text-center py-2.5 text-xs font-bold text-white bg-amber-600 hover:bg-amber-700 rounded-xl transition-all shadow-xs flex items-center justify-center gap-1.5"
              >
                Apply Reconciliation & Post Corrections
              </button>
            </form>
          </div>
        </div>

      </div>

      <div className="bg-white p-6 rounded-2xl border border-stone-100 shadow-xs space-y-4">
        <h4 className="font-serif font-bold text-stone-800 text-sm flex items-center gap-2 border-b border-stone-100 pb-2">
          <BookOpenCheck className="h-4 w-4 text-emerald-600" />
          Mismatches Reconciled History Logs
        </h4>

        {pastAudits.length === 0 ? (
          <p className="text-stone-400 text-xs italic">No historical physical stock reconciliation audits recorded yet.</p>
        ) : (
          <div className="space-y-4">
            {pastAudits.map((audit, idx) => {
              const countDiscrepancies = audit.items.filter(item => item.mismatchQty !== 0).length;

              return (
                <div key={idx} className="p-4 rounded-xl bg-stone-50 border border-stone-100 space-y-3">
                  <div className="flex justify-between items-start text-xs flex-col md:flex-row md:items-center gap-2">
                    <div className="space-y-0.5">
                      <span className="font-mono text-stone-800 font-bold bg-stone-200 px-1.5 py-0.5 rounded text-[10px]/normal uppercase">
                        Audit: {audit.id}
                      </span>
                      <p className="text-[10px] text-stone-500">
                        Recorded on: {new Date(audit.timestamp).toLocaleString([], { dateStyle: 'medium', timeStyle: 'short' })}
                      </p>
                    </div>
                    <div className="text-right">
                      <span className="text-[10px] text-stone-400 font-medium block">Auditor Signature</span>
                      <span className="font-semibold text-stone-800 font-serif text-[11px] block">{audit.recordedBy}</span>
                    </div>
                  </div>

                  <div className="border-t border-stone-200/50 pt-2.5">
                    <p className="text-stone-600 text-[11px] italic font-medium leading-relaxed bg-white border border-stone-100 rounded-lg p-2.5">
                      " {audit.notes} "
                    </p>
                  </div>

                  <div className="space-y-1.5 text-[11px] text-stone-500">
                    <p className="font-extrabold uppercase font-mono text-[9px] text-stone-400 tracking-wider">Adjustment Highlights ({countDiscrepancies} mismatches fixed):</p>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                      {audit.items.map((it, i) => {
                        const product = skus.find(s => s.id === it.skuId);
                        const isMismatch = it.mismatchQty !== 0;
                        if (!isMismatch) return null;

                        return (
                          <div key={i} className="flex justify-between items-center text-[10px] p-2 bg-white border border-stone-100 rounded-lg shadow-2xs">
                            <span className="font-medium truncate block max-w-[150px]">{product ? product.name : it.skuId}</span>
                            <span className={`font-mono font-bold px-1.5 py-0.5 rounded ${
                              it.mismatchQty > 0 
                                ? 'bg-emerald-50 text-emerald-700' 
                                : 'bg-rose-50 text-rose-700'
                            }`}>
                              {it.mismatchQty > 0 ? `+${it.mismatchQty}` : `${it.mismatchQty}`}
                            </span>
                          </div>
                        );
                      })}

                      {countDiscrepancies === 0 && (
                        <p className="text-stone-400 italic text-[10px]">No discrepancies found in this audit. Perfect count!</p>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

    </div>
  );
}
