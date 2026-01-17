import { DocumentStatus } from '../constants';
import { Cashbox } from './cashbox.interface';
import { Client } from './client.interface';
import { DocumentSaleItem } from './document-sale-item.interface';
import { PriceType } from './price-type.interface';
import { StockMovement } from './stock-movement.interface';
import { Store } from './store.interface';

export interface DocumentSale {
  id: string;
  code?: number;
  date?: string;
  store: Store;
  storeId: string;
  cashbox?: Cashbox;
  cashboxId?: string;
  client?: Client;
  clientId?: string;
  total?: number;
  items: DocumentSaleItem[];
  status?: DocumentStatus;
  priceType?: PriceType;
  priceTypeId?: string;
  createdAt?: string;
  updatedAt: string;
  movements: StockMovement[];
}
