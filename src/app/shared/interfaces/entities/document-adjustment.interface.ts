import { DocumentStatus } from './constants';
import { DocumentAdjustmentItem } from './document-adjustment-item.interface';
import { StockMovement } from './stock-movement.interface';
import { Store } from './store.interface';

export interface DocumentAdjustment {
  id: string;
  date?: Date;
  store: Store;
  storeId: string;
  items: DocumentAdjustmentItem[];
  status?: DocumentStatus;
  createdAt?: Date;
  updatedAt: Date;
  movements: StockMovement[];
}
