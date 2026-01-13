import { Cashbox } from './cashbox.interface';
import { Client } from './client.interface';
import { DocumentSaleItem } from './document-sale-item.interface';
import { DocumentStatus } from '../constants';
import { PriceType } from './price-type.interface';
import { StockMovement } from './stock-movement.interface';
import { Store } from './store.interface';

export interface DocumentSale {
  id: string;
  date?: Date;
  store: Store;
  storeId: string;
  cashbox?: Cashbox;
  cashboxId?: string;
  client?: Client;
  clientId?: string;
  totalAmount: number;
  items: DocumentSaleItem[];
  status?: DocumentStatus;
  priceType?: PriceType;
  priceTypeId?: string;
  createdAt?: Date;
  updatedAt: Date;
  movements: StockMovement[];
}
