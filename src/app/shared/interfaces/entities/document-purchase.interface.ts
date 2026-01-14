import { DocumentStatus } from '../constants';
import { DocumentPurchaseItem } from './document-purchase-item.interface';
import { PriceHistory } from './price-history.interface';
import { StockMovement } from './stock-movement.interface';
import { Store } from './store.interface';
import { Vendor } from './vendor.interface';

export interface DocumentPurchase {
  id: string;
  code?: number;
  date?: Date;
  vendor?: Vendor;
  vendorId?: string;
  store: Store;
  storeId: string;
  totalAmount: number;
  items: DocumentPurchaseItem[];
  status?: DocumentStatus;
  createdAt?: Date;
  updatedAt: Date;
  movements: StockMovement[];
  generatedPriceHistories: PriceHistory[];
}
