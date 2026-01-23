import { DocumentStatus } from '../constants';
import { DocumentLedger } from './document-ledger.interface';
import { DocumentPriceChange } from './document-price-change.interface';
import { DocumentPurchaseItem } from './document-purchase-item.interface';
import { InventoryReprocessing } from './inventory-reprocessing.interface';
import { StockLedger } from './stock-ledger.interface';
import { Store } from './store.interface';
import { Vendor } from './vendor.interface';

export interface DocumentPurchase {
  id: string;
  code?: number;
  date?: string;
  vendor?: Vendor;
  vendorId?: string;
  store: Store;
  storeId: string;
  total?: number;
  items: DocumentPurchaseItem[];
  status?: DocumentStatus;
  notes?: string;
  createdAt?: string;
  updatedAt: string;
  stockLedger: StockLedger[];
  documentLedger: DocumentLedger[];
  inventoryReprocessings: InventoryReprocessing[];
  generatedPriceChange?: DocumentPriceChange;
}
