
export interface FAQItem {
  question: string;
  answer: string;
  category: string;
}

export interface WorkflowStep {
  step: string;
  title: string;
  description: string;
  responsible: string;
  timeframe: string;
  bulletPoints: string[];
}

export interface ToolItem {
  name: string;
  type: string;
  purpose: string;
  suitability: string;
  costEstimate: string;
}

export interface ChallengeItem {
  challenge: string;
  impact: string;
  practicalSolution: string;
}

export const WORKFLOW_STEPS: WorkflowStep[] = [
  {
    step: 'Phase 1',
    title: 'Item Labeling & Barcode Generation',
    description: 'Set up unique SKU standards and attach physical labels to every single item entering the Bangalore store.',
    responsible: 'Warehouse Clerk & Store Inward Supervisor',
    timeframe: 'Day -7 to Day -1 (Before Store Launch)',
    bulletPoints: [
      'Assign systematic SKUs (e.g. DH-IDL-GAN-01) where DH is Divine Hindu, IDL is Category (Idol), GAN is Product identifier, 01 is Variant Size.',
      'Print adhesive barcode or QR code tags with item name, selling price (MRP), and SKU barcode.',
      'Physically paste label tags onto the base of brass idols, incense cartons, copper flasks, and mala envelopes.'
    ]
  },
  {
    step: 'Phase 2',
    title: 'Inward & GRN (Goods Received Note)',
    description: 'The formal protocol for accepting stock coming from main warehouses or Kumbakonam/Mysore suppliers.',
    responsible: 'Store Manager / Inward Head',
    timeframe: 'Ongoing (Daily morning check-in)',
    bulletPoints: [
      'Match physical carton count with Delivery Challan (DC) / Invoice from suppliers.',
      'Scan or enter SKU to log as INWARD in the local repository.',
      'Unbox and inspect products for tarnishment, dents, or transit cracks.',
      'Place accepted stock immediately onto active store shelves (Store Front) or backup cabinets.'
    ]
  },
  {
    step: 'Phase 3',
    title: 'Fulfillment & Real-time Sales Deductions',
    description: 'Selling items over the physical counter of the Bangalore store and ensuring stock reduces instantenously.',
    responsible: 'Sales Counter / Billing Cashier',
    timeframe: 'Ongoing (During operational hours 10 AM - 9 PM)',
    bulletPoints: [
      'Scan the SKU barcode at checkout register.',
      'Add transaction as OUTWARD_SALE, linking with actual bill number (e.g. DH-BGL-0491).',
      'Hand over sacred saffron carry bag to user.'
    ]
  },
  {
    step: 'Phase 4',
    title: 'Customer Returns & Defective Sorters',
    description: 'System for handling when customer returns an item (e.g., replacement or refund).',
    responsible: 'Store Supervisor',
    timeframe: 'Ongoing (Ad-hoc as requested)',
    bulletPoints: [
      'Inspect if item has been used, opened, or if original tags are present.',
      'If intact: Log as RETURN_CUSTOMER specifying destination as Store Shelf.',
      'If damaged or defective: Log as RETURN_CUSTOMER, routing to Damaged Bin for quarantine.'
    ]
  },
  {
    step: 'Phase 5',
    title: 'Quarantine, Damaged, and Supplier Dispatch',
    description: 'Regular check of the Damaged Bin and shipping defective items back to vendors or write-off.',
    responsible: 'Store Manager',
    timeframe: 'Weekly Friday Audit Room',
    bulletPoints: [
      'Review tarnished or dented items in Damaged Bin (quarantine rack).',
      'For items repairable: Dispatch back to artisans (e.g., Kumbakonam polishing) and log as RETURN_SUPPLIER.',
      'For unfixable expired/broken items (e.g. broken clay lamps, torn threads): Log write-off to empty the bin.'
    ]
  },
  {
    step: 'Phase 6',
    title: 'Weekly Cycle Count & Reconciliation',
    description: 'Physical audit of actual items vs digital counts to find, document, and resolve stock discrepancies.',
    responsible: 'Store Manager & Senior Executive (Dual check)',
    timeframe: 'Saturdays, post-operational closing hours',
    bulletPoints: [
      'Select 1-2 categories for physical count (rotating cycle count).',
      'Count physical items on shelves and compare to calculated digital quantities.',
      'Compute mismatch. If mismatch exists, adjust stock with custom audit transaction and document reasons (e.g., camphor open bottle evaporation, display theft, checkout registration error).'
    ]
  }
];

export const RECOMMENDED_TOOLS: ToolItem[] = [
  {
    name: 'Exempt/SOP Excel & Local Sheets',
    type: 'Baseline Spreadsheet',
    purpose: 'Initial operational log tracking & offline template for day-to-day log backing.',
    suitability: 'Highly stable offline tool but prone to manual editing mistakes or file loss.',
    costEstimate: 'Free'
  },
  {
    name: 'Loyverse POS',
    type: 'Cloud Mobile POS App',
    purpose: 'Direct billing platform on Android/iOS tablets. Deducts stock automatically upon scan.',
    suitability: 'Perfect for small physical retail stores, supports printing receipts and custom low-stock email alerts.',
    costEstimate: 'Free tier / Premium ₹1,500/month'
  },
  {
    name: 'Divine Hindu Custom Ledger App (This System)',
    type: 'Store Front Desk Dashboard',
    purpose: 'Daily operations control deck: SKU registers, specific inward/damaged loggers, reconciliation tool, and audit trail.',
    suitability: 'Customized directly for Bangalore Store’s special categories (Idols, Incenses, Copper) and local stock auditing.',
    costEstimate: 'Built-in (Zero Cost)'
  },
  {
    name: 'TallyPrime / Vyapar App',
    type: 'Accounting & GST Sorter',
    purpose: 'Align stock billing with local Karnataka state GST, managing credit books, and supplier invoices.',
    suitability: 'Best for regulatory financial compliance and official annual audited accounts.',
    costEstimate: 'Vyapar: ₹2,500/year, Tally: ₹18,000 lifetime'
  }
];

export const CHALLENGES_SOLUTIONS: ChallengeItem[] = [
  {
    challenge: 'Camphor & Incense Natural Shrinkage (Weight Loss/Evaporation)',
    impact: 'Camphor crystals sublime over time in warm Bangalore store conditions; incense sticks lose moisture.',
    practicalSolution: 'Keep reserve stock in zip-locked, sealed cool bins. Mandate a standard 1.5% "natural wastage" allowance in manual weekly reconciliations, rather than treating it as staff theft or missing stock.'
  },
  {
    challenge: 'Artisan Batch Inconsistencies (No barcodes from rural vendors)',
    impact: 'Kumbakonam brass sculptors and Vrindavan thread-weavers supply products in large burlap sacks without any packaging or codes.',
    practicalSolution: 'Establish an "Inward Quarantine Desk" in the store backroom. All rural supplier bags must be unpacked, sorted into master sizes, safety-checked, and barcoded with custom Divine Hindu SKU stickers BEFORE hitting the front shelves.'
  },
  {
    challenge: 'Peak Festive Sales Log Jams (Janmashtami, Diwali, Ganesh Chaturthi)',
    impact: 'Huge footfall of spiritual buyers leads to fast checkouts. Cashiers bypass scanning to expedite billing, resulting in severe real-time stock mismatches.',
    practicalSolution: 'Introduce pre-packaged festive kits (e.g. "Diwali Puja Box") as a single bundled SKU with pre-printed carton barcodes, rather than scanning 12 individual puja ingredients under intense crowd pressure.'
  },
  {
    challenge: 'Tarnishing of Copper & Brass display pieces',
    impact: 'Raw copper and brass idols oxidize quickly when touched by customers or exposed to air, rendering them display-tarnished.',
    practicalSolution: 'Clean and rub with specialized brass polish weekly. If tarnishing becomes deep, transfer the item with an "OUTWARD_DAMAGED / Tarnished Display" transaction to the quarantine bin, and dispatch it to restoration.'
  }
];
