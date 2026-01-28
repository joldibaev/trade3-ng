// This file is auto-generated. Do not edit.

import { DocumentStatus } from '../constants';
import { DocumentHistory } from './document-history.interface';
import { DocumentPriceChange } from './document-price-change.interface';
import { DocumentPurchaseItem } from './document-purchase-item.interface';
import { InventoryReprocessing } from './inventory-reprocessing.interface';
import { StockLedger } from './stock-ledger.interface';
import { Store } from './store.interface';
import { User } from './user.interface';
import { Vendor } from './vendor.interface';

export interface DocumentPurchase {
  id: string;
  code: string;
  date: string;
  vendor?: Vendor;
  vendorId?: string;
  store: Store;
  storeId: string;
  total: number;
  items: DocumentPurchaseItem[];
  status: DocumentStatus;
  notes?: string;
  createdAt: string;
  updatedAt: string;
  stockLedger: StockLedger[];
  documentHistory: DocumentHistory[];
  inventoryReprocessings: InventoryReprocessing[];
  generatedPriceChange?: DocumentPriceChange;
  author?: User;
  authorId?: string;
}
