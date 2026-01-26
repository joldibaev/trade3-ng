import { DocumentStatus } from '../constants';
import { Cashbox } from './cashbox.interface';
import { Client } from './client.interface';
import { DocumentHistory } from './document-history.interface';
import { DocumentSaleItem } from './document-sale-item.interface';
import { InventoryReprocessing } from './inventory-reprocessing.interface';
import { PriceType } from './price-type.interface';
import { StockLedger } from './stock-ledger.interface';
import { Store } from './store.interface';

export interface DocumentSale {
  id: string;
  code: string;
  date: string;
  store: Store;
  storeId: string;
  cashbox?: Cashbox;
  cashboxId?: string;
  client?: Client;
  clientId?: string;
  total: number;
  items: DocumentSaleItem[];
  status: DocumentStatus;
  priceType?: PriceType;
  priceTypeId?: string;
  notes?: string;
  createdAt: string;
  updatedAt: string;
  stockLedger: StockLedger[];
  documentHistory: DocumentHistory[];
  inventoryReprocessings: InventoryReprocessing[];
}
