import { DocumentStatus } from './constants';
import { DocumentTransferItem } from './document-transfer-item.interface';
import { StockMovement } from './stock-movement.interface';
import { Store } from './store.interface';

export interface DocumentTransfer {
  id: string;
  date?: Date;
  sourceStore: Store;
  sourceStoreId: string;
  destinationStore: Store;
  destinationStoreId: string;
  items: DocumentTransferItem[];
  status?: DocumentStatus;
  createdAt?: Date;
  updatedAt: Date;
  movements: StockMovement[];
}
