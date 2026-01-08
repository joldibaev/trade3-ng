import { DocumentPurchaseItem } from './document-purchase-item.interface';
import { DocumentStatus } from './constants';
import { StockMovement } from './stock-movement.interface';
import { Store } from './store.interface';
import { Vendor } from './vendor.interface';

export interface DocumentPurchase {
  id: string;
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
}
