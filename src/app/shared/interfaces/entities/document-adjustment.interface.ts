import { DocumentStatus } from '../constants';
import { DocumentAdjustmentItem } from './document-adjustment-item.interface';
import { DocumentHistory } from './document-history.interface';
import { StockMovement } from './stock-movement.interface';
import { Store } from './store.interface';

export interface DocumentAdjustment {
  id: string;
  code?: number;
  date?: string;
  store: Store;
  storeId: string;
  items: DocumentAdjustmentItem[];
  status?: DocumentStatus;
  notes?: string;
  createdAt?: string;
  updatedAt: string;
  deletedAt?: string;
  movements: StockMovement[];
  history: DocumentHistory[];
}
