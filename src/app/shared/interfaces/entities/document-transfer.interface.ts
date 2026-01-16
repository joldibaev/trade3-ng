import { DocumentStatus } from '../constants';
import { DocumentTransferItem } from './document-transfer-item.interface';
import { StockMovement } from './stock-movement.interface';
import { Store } from './store.interface';

export interface DocumentTransfer {
  id: string;
  code?: number;
  date?: string;
  sourceStore: Store;
  sourceStoreId: string;
  destinationStore: Store;
  destinationStoreId: string;
  items: DocumentTransferItem[];
  status?: DocumentStatus;
  createdAt?: string;
  updatedAt: string;
  movements: StockMovement[];
}
