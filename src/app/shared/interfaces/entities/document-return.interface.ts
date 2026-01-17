import { DocumentStatus } from '../constants';
import { Client } from './client.interface';
import { DocumentReturnItem } from './document-return-item.interface';
import { StockMovement } from './stock-movement.interface';
import { Store } from './store.interface';

export interface DocumentReturn {
  id: string;
  code?: number;
  date?: string;
  store: Store;
  storeId: string;
  client?: Client;
  clientId?: string;
  total?: number;
  items: DocumentReturnItem[];
  status?: DocumentStatus;
  createdAt?: string;
  updatedAt: string;
  movements: StockMovement[];
}
