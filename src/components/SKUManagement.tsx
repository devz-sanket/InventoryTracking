
import React, { useState, useMemo } from 'react';
import { SKU, SKUCategory } from '../types';
import { calculateCurrentStock } from '../utils/storage';
import { Search, Plus, Edit2, Trash2, Folder, AlertTriangle, CheckCircle2, Coins } from 'lucide-react';

interface SKUManagementProps {
  skus: SKU[];
  transactions: any[];
  onAddSKU: (sku: SKU) => void;
  onEditSKU: (sku: SKU) => void;
  onDeleteSKU: (id: string) => void;
}

export default function SKUManagement({ skus, transactions, onAddSKU, onEditSKU, onDeleteSKU }: SKUManagementProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('ALL');
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingSku, setEditingSku] = useState<SKU | null>(null);

  const [skuId, setSkuId] = useState('');
  const [skuName, setSkuName] = useState('');
  const [category, setCategory] = useState<SKUCategory>('Brass Idols');
  const [price, setPrice] = useState<number>(0);
  const [costPrice, setCostPrice] = useState<number>(0);
  const [minStockAlert, setMinStockAlert] = useState<number>(5);
  const [openingStock, setOpeningStock] = useState<number>(10);
  const [notes, setNotes] = useState('');

  const [formError, setFormError] = useState('');

  const categories: SKUCategory[] = [
    'Brass Idols',
    'Incense & Dhoop',
    'Puja Essentials',
    'Sacred Adornments',
    'Copper & Brass Utensils'
  ];

  const handleOpenAdd = () => {
    setEditingSku(null);
    setSkuId('');
    setSkuName('');
    setCategory('Brass Idols');
    setPrice(0);
    setCostPrice(0);
    setMinStockAlert(5);
    setOpeningStock(10);
    setNotes('');
    setFormError('');
    setIsFormOpen(true);
  };

  const handleOpenEdit = (sku: SKU) => {
    setEditingSku(sku);
    setSkuId(sku.id);
    setSkuName(sku.name);
    setCategory(sku.category);
    setPrice(sku.price);
    setCostPrice(sku.costPrice);
    setMinStockAlert(sku.minStockAlert);
    setOpeningStock(sku.openingStock);
    setNotes(sku.notes || '');
    setFormError('');
    setIsFormOpen(true);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setFormError('');

    if (!skuId.trim() || !skuName.trim()) {
      setFormError('SKU ID and SKU Name are required.');
      return;
    }

    if (!editingSku) {
      const exists = skus.some((s) => s.id.toLowerCase() === skuId.toLowerCase());
      if (exists) {
        setFormError('A product with this SKU code already exists. Please choose a unique SKU ID.');
        return;
      }
    }

    if (price <= 0 || costPrice <= 0) {
      setFormError('MRP Price and Cost Price must be positive values.');
      return;
    }

    if (costPrice > price) {
      setFormError('Warning: Landing Cost is higher than selling price!');
    }

    const payload: SKU = {
      id: skuId.toUpperCase().replace(/\s+/g, '-'),
      name: skuName,
      category,
      price,
      costPrice,
      minStockAlert,
      openingStock,
      notes,
    };

    if (editingSku) {
      onEditSKU(payload);
    } else {
      onAddSKU(payload);
    }

    setIsFormOpen(false);
  };

  const filteredSKUs = useMemo(() => {
    return skus.filter((sku) => {
      const matchSearch = sku.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          sku.id.toLowerCase().includes(searchQuery.toLowerCase());
      const matchCategory = selectedCategory === 'ALL' || sku.category === selectedCategory;
      return matchSearch && matchCategory;
    });
  }, [skus, searchQuery, selectedCategory]);

  return (
    <div className="space-y-6">

      <div className="flex flex-col md:flex-row gap-4 items-center justify-between">

        <div className="relative w-full md:w-96">
          <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-stone-400">
            <Search className="h-4 w-4" />
          </span>
          <input
            type="text"
            className="w-full pl-9 pr-4 py-2 text-stone-700 bg-white border border-stone-200 rounded-xl focus:border-amber-500 focus:ring-1 focus:ring-amber-500 text-sm outline-hidden"
            placeholder="Search SKU ID or product name..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>

        <div className="flex flex-wrap gap-2 items-center w-full md:w-auto">
          <button
            onClick={() => setSelectedCategory('ALL')}
            className={`px-3 py-1.5 rounded-xl border text-xs font-semibold transition-colors ${
              selectedCategory === 'ALL'
                ? 'bg-amber-100/90 text-amber-900 border-amber-200 shadow-sm'
                : 'bg-white border-stone-200 text-stone-600 hover:bg-stone-50'
            }`}
          >
            All Products
          </button>
          {categories.map((cat, idx) => (
            <button
              key={idx}
              onClick={() => setSelectedCategory(cat)}
              className={`px-3 py-1.5 rounded-xl border text-xs font-semibold transition-colors ${
                selectedCategory === cat
                  ? 'bg-amber-100/90 text-amber-900 border-amber-200 shadow-sm'
                  : 'bg-white border-stone-200 text-stone-600 hover:bg-stone-50'
              }`}
            >
              {cat}
            </button>
          ))}

          <button
            onClick={handleOpenAdd}
            className="ml-auto inline-flex items-center gap-1.5 px-4 py-2 text-xs font-bold text-white bg-amber-600 rounded-xl hover:bg-amber-700 transition-colors shadow-xs"
          >
            <Plus className="h-4 w-4" />
            Create SKU
          </button>
        </div>

      </div>

      <div className="bg-white rounded-2xl border border-stone-100 shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-stone-50 border-b border-stone-100 text-stone-500 uppercase font-mono text-[10px] tracking-wider">
                <th className="px-6 py-4">SKU / Item Details</th>
                <th className="px-6 py-4">Spiritual Category</th>
                <th className="px-6 py-4 text-right">Cost Price</th>
                <th className="px-6 py-4 text-right">Selling Price</th>
                <th className="px-6 py-4 text-center">Opening Stock</th>
                <th className="px-6 py-4 text-center">Live Stock</th>
                <th className="px-6 py-4 text-center">Stock Satus</th>
                <th className="px-6 py-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-stone-50 text-xs text-stone-600">
              {filteredSKUs.length === 0 ? (
                <tr>
                  <td colSpan={8} className="text-center py-10 italic text-stone-400">
                    No matching products found. Try creating a new SKU.
                  </td>
                </tr>
              ) : (
                filteredSKUs.map((sku) => {
                  const currentStock = calculateCurrentStock(sku, transactions);
                  const isLow = currentStock <= sku.minStockAlert;

                  return (
                    <tr key={sku.id} className="hover:bg-amber-50/20 transition-colors">

                      <td className="px-6 py-4 max-w-[250px]">
                        <div className="space-y-1">
                          <span className="font-mono bg-stone-100 border border-stone-200/50 text-stone-800 font-bold px-1.5 py-0.5 rounded text-[10px] tracking-wide inline-block">
                            {sku.id}
                          </span>
                          <span className="block font-medium text-stone-800 text-sm leading-tight">
                            {sku.name}
                          </span>
                          {sku.notes && (
                            <span className="block text-[10px] text-stone-500 truncate italic">
                              {sku.notes}
                            </span>
                          )}
                        </div>
                      </td>

                      <td className="px-6 py-4">
                        <span className="inline-flex items-center gap-1 bg-stone-50 text-stone-700 border border-stone-200 px-2 py-1 rounded-full text-[10px] font-semibold">
                          <Folder className="h-3 w-3 text-stone-400" />
                          {sku.category}
                        </span>
                      </td>

                      <td className="px-6 py-4 text-right font-mono text-stone-600">
                        ₹{sku.costPrice.toLocaleString()}
                      </td>

                      <td className="px-6 py-4 text-right font-mono font-bold text-stone-800">
                        ₹{sku.price.toLocaleString()}
                      </td>

                      <td className="px-6 py-4 text-center font-mono">
                        {sku.openingStock}
                      </td>

                      <td className="px-6 py-4 text-center">
                        <span className={`font-mono text-sm font-bold px-2 py-0.5 rounded-lg ${
                          isLow 
                            ? 'bg-rose-50 text-rose-700 border border-rose-100' 
                            : 'bg-emerald-50 text-emerald-800 border border-emerald-100'
                        }`}>
                          {currentStock}
                        </span>
                      </td>

                      <td className="px-6 py-4 text-center">
                        <span className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full font-sans text-[10px] font-bold ${
                          isLow
                            ? 'bg-rose-100 text-rose-800 border border-rose-200'
                            : 'bg-emerald-100 text-emerald-800 border border-emerald-200'
                        }`}>
                          {isLow ? (
                            <>
                              <AlertTriangle className="h-3 w-3 shrink-0 animate-pulse" />
                              REORDER LEVEL
                            </>
                          ) : (
                            <>
                              <CheckCircle2 className="h-3 w-3 shrink-0" />
                              IN STOCK
                            </>
                          )}
                        </span>
                      </td>

                      <td className="px-6 py-4 text-right">
                        <div className="flex justify-end gap-1.5">
                          <button
                            onClick={() => handleOpenEdit(sku)}
                            title="Edit Product"
                            className="p-1.5 hover:bg-stone-50 border border-stone-200 rounded-lg text-stone-500 hover:text-stone-700 transition-colors"
                          >
                            <Edit2 className="h-3.5 w-3.5" />
                          </button>
                          <button
                            onClick={() => {
                              if (confirm(`Are you sure you want to delete SKU ${sku.id} (${sku.name})? This cannot be undone.`)) {
                                onDeleteSKU(sku.id);
                              }
                            }}
                            title="Delete SKU"
                            className="p-1.5 hover:bg-rose-50 border border-rose-200 rounded-lg text-stone-400 hover:text-rose-600 transition-colors"
                          >
                            <Trash2 className="h-3.5 w-3.5" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>

      {isFormOpen && (
        <div className="fixed inset-0 bg-stone-900/40 backdrop-blur-xs flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-3xl shadow-xl border border-stone-100 w-full max-w-xl overflow-hidden">

            <div className="bg-gradient-to-r from-amber-600 to-amber-700 p-5 text-white flex justify-between items-center">
              <div>
                <h3 className="font-serif text-lg font-bold">
                  {editingSku ? 'Modify SKU Specifications' : 'Initialize New Sacred SKU'}
                </h3>
                <p className="text-amber-100 text-[11px]">Divine Hindu Bangalore Operational Catalog Registers</p>
              </div>
              <button 
                onClick={() => setIsFormOpen(false)}
                className="text-white hover:text-amber-200 font-bold text-lg"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleSubmit} className="p-6 space-y-4">

              {formError && (
                <div className="p-3 bg-rose-50 border border-rose-100 rounded-xl text-rose-700 text-xs font-medium">
                  {formError}
                </div>
              )}

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">

                <div className="space-y-1">
                  <label className="text-stone-600 font-medium text-xs block">SKU Code (Unique ID)</label>
                  <input
                    type="text"
                    required
                    disabled={!!editingSku}
                    className="w-full px-3 py-1.5 text-xs text-stone-700 bg-stone-50 border border-stone-200 rounded-lg uppercase disabled:text-stone-400 focus:outline-hidden focus:border-amber-500"
                    placeholder="e.g. DH-IDL-GAN-02"
                    value={skuId}
                    onChange={(e) => setSkuId(e.target.value)}
                  />
                  <p className="text-[10px] text-stone-400">Strict format prefix: DH-[CAT]-[NAME]-[SIZE]</p>
                </div>

                <div className="space-y-1">
                  <label className="text-stone-600 font-medium text-xs block">Product Title</label>
                  <input
                    type="text"
                    required
                    className="w-full px-3 py-1.5 text-xs text-stone-700 border border-stone-200 rounded-lg focus:outline-hidden focus:border-amber-500"
                    placeholder="e.g. Handrolled Sandalwood Incense"
                    value={skuName}
                    onChange={(e) => setSkuName(e.target.value)}
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">

                <div className="space-y-1">
                  <label className="text-stone-600 font-medium text-xs block">Product Category</label>
                  <select
                    className="w-full px-3 py-1.5 text-xs text-stone-700 border border-stone-200 rounded-lg focus:outline-hidden focus:border-amber-500"
                    value={category}
                    onChange={(e) => setCategory(e.target.value as SKUCategory)}
                  >
                    {categories.map((c, i) => (
                      <option key={i} value={c}>{c}</option>
                    ))}
                  </select>
                </div>

                <div className="space-y-1">
                  <label className="text-stone-600 font-medium text-xs block">Minimum Stock Threshold</label>
                  <input
                    type="number"
                    min="1"
                    className="w-full px-3 py-1.5 text-xs text-stone-700 border border-stone-200 rounded-lg focus:outline-hidden focus:border-amber-500"
                    value={minStockAlert}
                    onChange={(e) => setMinStockAlert(Number(e.target.value))}
                  />
                  <p className="text-[10px] text-stone-400">Triggers reorder warning when stock drops below this.</p>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">

                <div className="space-y-1">
                  <label className="text-stone-600 font-medium text-xs block flex items-center gap-1">
                    <Coins className="h-3 w-3 text-stone-400" />
                    Custom cost (₹)
                  </label>
                  <input
                    type="number"
                    min="1"
                    required
                    className="w-full px-3 py-1.5 text-xs text-stone-700 border border-stone-200 rounded-lg focus:outline-hidden focus:border-amber-500"
                    value={costPrice || ''}
                    onChange={(e) => setCostPrice(Number(e.target.value))}
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-stone-600 font-medium text-xs block">Sale Price / MRP (₹)</label>
                  <input
                    type="number"
                    min="1"
                    required
                    className="w-full px-3 py-1.5 text-xs text-stone-700 border border-stone-200 rounded-lg focus:outline-hidden focus:border-amber-500"
                    value={price || ''}
                    onChange={(e) => setPrice(Number(e.target.value))}
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-stone-600 font-medium text-xs block">Opening Stock Balance</label>
                  <input
                    type="number"
                    min="0"
                    disabled={!!editingSku}
                    className="w-full px-3 py-1.5 text-xs text-stone-700 border border-stone-200 rounded-lg focus:outline-hidden focus:border-amber-500 disabled:bg-stone-50 disabled:text-stone-400"
                    value={openingStock}
                    onChange={(e) => setOpeningStock(Number(e.target.value))}
                  />
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-stone-600 font-medium text-xs block">Artisan & Product Remarks</label>
                <textarea
                  className="w-full px-3 py-2 text-xs text-stone-700 border border-stone-200 rounded-lg focus:outline-hidden focus:border-amber-500"
                  rows={2}
                  placeholder="Mention artisan sources (e.g. Kumbakonam, Mysore), polishing seal state, or packaging specifications..."
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                />
              </div>

              <div className="pt-2 flex justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setIsFormOpen(false)}
                  className="px-4 py-2 border border-stone-200 rounded-xl text-stone-600 text-xs hover:bg-stone-50"
                >
                  Discard
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 text-xs font-bold text-white bg-amber-600 rounded-xl hover:bg-amber-700 shadow-sm"
                >
                  {editingSku ? 'Apply Update' : 'Initialize SKU'}
                </button>
              </div>

            </form>
          </div>
        </div>
      )}

    </div>
  );
}
