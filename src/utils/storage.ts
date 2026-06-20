
import { SKU, InventoryTransaction, StockReconciliation, INITIAL_SKUS, INITIAL_TRANSACTIONS, INITIAL_AUDITS } from '../types';

const STORAGE_KEYS = {
  SKUS: 'dh_inventory_skus',
  TRANSACTIONS: 'dh_inventory_txns',
  AUDITS: 'dh_inventory_audits',
};

export const getStoredSKUs = (): SKU[] => {
  const data = localStorage.getItem(STORAGE_KEYS.SKUS);
  if (data) {
    try {
      return JSON.parse(data);
    } catch {
      return INITIAL_SKUS;
    }
  }

  localStorage.setItem(STORAGE_KEYS.SKUS, JSON.stringify(INITIAL_SKUS));
  return INITIAL_SKUS;
};

export const saveSKUs = (skus: SKU[]): void => {
  localStorage.setItem(STORAGE_KEYS.SKUS, JSON.stringify(skus));
};

export const getStoredTransactions = (): InventoryTransaction[] => {
  const data = localStorage.getItem(STORAGE_KEYS.TRANSACTIONS);
  if (data) {
    try {
      return JSON.parse(data);
    } catch {
      return INITIAL_TRANSACTIONS;
    }
  }
  localStorage.setItem(STORAGE_KEYS.TRANSACTIONS, JSON.stringify(INITIAL_TRANSACTIONS));
  return INITIAL_TRANSACTIONS;
};

export const saveTransactions = (txns: InventoryTransaction[]): void => {
  localStorage.setItem(STORAGE_KEYS.TRANSACTIONS, JSON.stringify(txns));
};

export const getStoredAudits = (): StockReconciliation[] => {
  const data = localStorage.getItem(STORAGE_KEYS.AUDITS);
  if (data) {
    try {
      return JSON.parse(data);
    } catch {
      return INITIAL_AUDITS;
    }
  }
  localStorage.setItem(STORAGE_KEYS.AUDITS, JSON.stringify(INITIAL_AUDITS));
  return INITIAL_AUDITS;
};

export const saveAudits = (audits: StockReconciliation[]): void => {
  localStorage.setItem(STORAGE_KEYS.AUDITS, JSON.stringify(audits));
};

export const calculateCurrentStock = (
  sku: SKU,
  transactions: InventoryTransaction[]
): number => {
  let stock = sku.openingStock;

  const skuTxns = transactions.filter((t) => t.skuId === sku.id);

  skuTxns.forEach((txn) => {
    switch (txn.type) {
      case 'INWARD':
      case 'RETURN_CUSTOMER':
        stock += txn.quantity;
        break;
      case 'OUTWARD_SALE':
      case 'OUTWARD_DAMAGED':
      case 'RETURN_SUPPLIER':
        stock -= txn.quantity;
        break;
      case 'RECONCILIATION':

        stock += txn.quantity; 
        break;
    }
  });

  return Math.max(0, stock);
};
