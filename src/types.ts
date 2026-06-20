
export type SKUCategory =
  | 'Brass Idols'
  | 'Incense & Dhoop'
  | 'Puja Essentials'
  | 'Sacred Adornments'
  | 'Copper & Brass Utensils';

export type TransactionType =
  | 'INWARD'            
  | 'OUTWARD_SALE'       
  | 'OUTWARD_DAMAGED'    
  | 'RETURN_CUSTOMER'    
  | 'RETURN_SUPPLIER'    
  | 'RECONCILIATION';    

export interface SKU {
  id: string; 
  name: string;
  category: SKUCategory;
  price: number; 
  costPrice: number; 
  minStockAlert: number; 
  openingStock: number; 
  notes?: string;
}

export interface InventoryTransaction {
  id: string;
  skuId: string;
  type: TransactionType;
  quantity: number;
  timestamp: string; 
  source: string; 
  destination: string; 
  notes: string;
  recordedBy: string; 
}

export interface StockReconciliation {
  id: string;
  timestamp: string;
  recordedBy: string;
  notes: string;
  items: {
    skuId: string;
    systemQty: number;
    physicalQty: number;
    mismatchQty: number; 
    resolved: boolean;
    resolutionNotes?: string;
  }[];
}

export interface SupportGuideSection {
  title: string;
  icon: string;
  content: string[];
}

export const INITIAL_SKUS: SKU[] = [
  {
    id: 'DH-IDL-GAN-01',
    name: 'Ashta Ganesha Brass Idol (6 inch)',
    category: 'Brass Idols',
    price: 3499,
    costPrice: 1950,
    minStockAlert: 5,
    openingStock: 25,
    notes: 'Handcrafted premium brass, antique finish.',
  },
  {
    id: 'DH-IDL-SHV-02',
    name: 'Dancing Nataraja Brass Deity (8 inch)',
    category: 'Brass Idols',
    price: 4999,
    costPrice: 2800,
    minStockAlert: 3,
    openingStock: 12,
    notes: 'Exquisite detailing from Kumbakonam artisans.',
  },
  {
    id: 'DH-INC-SAN-11',
    name: 'Premium Sandalwood Temple Incense (100g)',
    category: 'Incense & Dhoop',
    price: 249,
    costPrice: 110,
    minStockAlert: 20,
    openingStock: 150,
    notes: 'Natural Mysore sandal, charcoal-free.',
  },
  {
    id: 'DH-INC-GUG-12',
    name: 'Sambrani Guggal Loban Cups (Box of 12)',
    category: 'Incense & Dhoop',
    price: 180,
    costPrice: 85,
    minStockAlert: 15,
    openingStock: 80,
    notes: 'Direct cow-dung base with intense premium resin.',
  },
  {
    id: 'DH-PUJ-THL-21',
    name: 'Sacred Panch Aarti Brass Plate',
    category: 'Puja Essentials',
    price: 850,
    costPrice: 450,
    minStockAlert: 8,
    openingStock: 30,
    notes: 'Traditional heavy-gauge brass, anti-tarnish coated.',
  },
  {
    id: 'DH-PUJ-CMP-22',
    name: 'Organic Bhimseni Camphor (200g)',
    category: 'Puja Essentials',
    price: 450,
    costPrice: 240,
    minStockAlert: 10,
    openingStock: 45,
    notes: '100% pure medicinal camphor flakes.',
  },
  {
    id: 'DH-ADR-RUD-31',
    name: '5-Mukhi Nepali Rudraksha Mala (108+1)',
    category: 'Sacred Adornments',
    price: 1250,
    costPrice: 600,
    minStockAlert: 5,
    openingStock: 15,
    notes: 'Lab-certified authentic beads (7mm-8mm).',
  },
  {
    id: 'DH-ADR-TUL-32',
    name: 'Pure Tulsi Japa Mala with Cow-Silk Tassel',
    category: 'Sacred Adornments',
    price: 350,
    costPrice: 140,
    minStockAlert: 12,
    openingStock: 60,
    notes: 'Aromatic authentic basil stems handcrafted in Vrindavan.',
  },
  {
    id: 'DH-UTN-COP-41',
    name: 'Engraved Pure Copper Tamra Jal Bottle (1L)',
    category: 'Copper & Brass Utensils',
    price: 1199,
    costPrice: 620,
    minStockAlert: 10,
    openingStock: 35,
    notes: 'Leak-proof seamless design, 99.9% pure copper.',
  },
  {
    id: 'DH-UTN-COP-42',
    name: 'Copper Tambula Panchapatra Set',
    category: 'Copper & Brass Utensils',
    price: 420,
    costPrice: 200,
    minStockAlert: 6,
    openingStock: 22,
    notes: 'Includes copper vessel and sacred Achamani spoon.',
  },
];

export const INITIAL_TRANSACTIONS: InventoryTransaction[] = [

  {
    id: 'TXN-1001',
    skuId: 'DH-IDL-GAN-01',
    type: 'INWARD',
    quantity: 10,
    timestamp: '2026-06-15T10:30:00Z',
    source: 'Central Warehouse Bangalore',
    destination: 'Store Shelf',
    notes: 'Initial opening supplement batch for store launch prep.',
    recordedBy: 'Anand Rao (Store Manager)',
  },
  {
    id: 'TXN-1002',
    skuId: 'DH-INC-SAN-11',
    type: 'INWARD',
    quantity: 50,
    timestamp: '2026-06-15T11:00:00Z',
    source: 'Central Warehouse Bangalore',
    destination: 'Store Shelf',
    notes: 'Replenishing fast-moving Sandal incense box.',
    recordedBy: 'Anand Rao (Store Manager)',
  },

  {
    id: 'TXN-1003',
    skuId: 'DH-IDL-GAN-01',
    type: 'OUTWARD_SALE',
    quantity: 3,
    timestamp: '2026-06-16T15:45:00Z',
    source: 'Store Shelf',
    destination: 'Sold (Bill #DH-BGL-0001)',
    notes: 'Grand Opening Day sales counter.',
    recordedBy: 'Priya Sharma (Sales Executive)',
  },
  {
    id: 'TXN-1004',
    skuId: 'DH-ADR-RUD-31',
    type: 'OUTWARD_SALE',
    quantity: 2,
    timestamp: '2026-06-16T16:10:00Z',
    source: 'Store Shelf',
    destination: 'Sold (Bill #DH-BGL-0002)',
    notes: 'Counter sales, purchased with brass puja items.',
    recordedBy: 'Priya Sharma (Sales Executive)',
  },
  {
    id: 'TXN-1005',
    skuId: 'DH-INC-SAN-11',
    type: 'OUTWARD_SALE',
    quantity: 15,
    timestamp: '2026-06-17T12:00:00Z',
    source: 'Store Shelf',
    destination: 'Sold (Bulk counter sales)',
    notes: 'Sold to local Hanuman temple trust committee.',
    recordedBy: 'Priya Sharma (Sales Executive)',
  },

  {
    id: 'TXN-1006',
    skuId: 'DH-UTN-COP-41',
    type: 'OUTWARD_DAMAGED',
    quantity: 1,
    timestamp: '2026-06-17T18:00:00Z',
    source: 'Store Shelf',
    destination: 'Damaged Bin',
    notes: 'Severe dent on outer surface discovered in display rack inspection.',
    recordedBy: 'Anand Rao (Store Manager)',
  },

  {
    id: 'TXN-1007',
    skuId: 'DH-PUJ-THL-21',
    type: 'RETURN_CUSTOMER',
    quantity: 1,
    timestamp: '2026-06-18T14:20:00Z',
    source: 'Customer (Return slip #DH-RET-01)',
    destination: 'Store Shelf',
    notes: 'Exchange for a larger deepak plate. Item intact, anti-tarnish seal check OK.',
    recordedBy: 'Priya Sharma (Sales Executive)',
  },

  {
    id: 'TXN-1008',
    skuId: 'DH-IDL-SHV-02',
    type: 'RETURN_SUPPLIER',
    quantity: 1,
    timestamp: '2026-06-19T10:00:00Z',
    source: 'Damaged Bin',
    destination: 'Supplier Returned - Kumbakonam Crafts',
    notes: 'Tarnishing near pedestal; returning for polishing/refurbishment under warranty.',
    recordedBy: 'Anand Rao (Store Manager)',
  },
];

export const INITIAL_AUDITS: StockReconciliation[] = [
  {
    id: 'AUD-301',
    timestamp: '2026-06-18T19:30:00Z',
    recordedBy: 'Anand Rao (Store Manager)',
    notes: 'First weekly cycle count for Premium Puja Essentials.',
    items: [
      {
        skuId: 'DH-PUJ-CMP-22',
        systemQty: 45,
        physicalQty: 44,
        mismatchQty: -1,
        resolved: true,
        resolutionNotes: 'Minor camphor weight shrinkage due to open test jar. Adjusted stock level with audit note.',
      },
      {
        skuId: 'DH-PUJ-THL-21',
        systemQty: 30,
        physicalQty: 30,
        mismatchQty: 0,
        resolved: true,
        resolutionNotes: 'Stock aligned perfectly with system records.',
      },
    ],
  },
];
