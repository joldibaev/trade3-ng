// This file is auto-generated. Do not edit.

import { DocumentStatus } from '../constants';
import { DocumentHistory } from './document-history.interface';
import { DocumentTransferItem } from './document-transfer-item.interface';
import { InventoryReprocessing } from './inventory-reprocessing.interface';
import { StockLedger } from './stock-ledger.interface';
import { Store } from './store.interface';
import { User } from './user.interface';

export interface DocumentTransfer {
  id: string;
  code: string;
  date: string;
  sourceStore: Store;
  sourceStoreId: string;
  destinationStore: Store;
  destinationStoreId: string;
  items: DocumentTransferItem[];
  status: DocumentStatus;
  notes?: string;
  createdAt: string;
  updatedAt: string;
  stockLedger: StockLedger[];
  documentHistory: DocumentHistory[];
  inventoryReprocessings: InventoryReprocessing[];
  author?: User;
  authorId?: string;
}
