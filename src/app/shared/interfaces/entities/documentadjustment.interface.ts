import { DocumentAdjustmentItem } from './documentadjustmentitem.interface';
import { DocumentStatus } from './constants';
import { StockMovement } from './stockmovement.interface';
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
