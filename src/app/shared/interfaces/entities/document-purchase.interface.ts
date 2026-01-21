import { DocumentStatus } from '../constants';
import { DocumentHistory } from './document-history.interface';
import { DocumentPurchaseItem } from './document-purchase-item.interface';
import { PriceHistory } from './price-history.interface';
import { StockMovement } from './stock-movement.interface';
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
  deletedAt?: string;
  movements: StockMovement[];
  history: DocumentHistory[];
  generatedPriceHistories: PriceHistory[];
}
