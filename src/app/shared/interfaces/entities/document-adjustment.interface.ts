import { DocumentStatus } from '../constants';
import { DocumentAdjustmentItem } from './document-adjustment-item.interface';
import { DocumentHistory } from './document-history.interface';
import { InventoryReprocessing } from './inventory-reprocessing.interface';
import { StockLedger } from './stock-ledger.interface';
import { Store } from './store.interface';

export interface DocumentAdjustment {
  id: string;
  code: string;
  date: string;
  store: Store;
  storeId: string;
  items: DocumentAdjustmentItem[];
  status: DocumentStatus;
  notes?: string;
  createdAt: string;
  updatedAt: string;
  stockLedger: StockLedger[];
  documentHistory: DocumentHistory[];
  inventoryReprocessings: InventoryReprocessing[];
}
