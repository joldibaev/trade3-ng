import { DocumentSale } from './documentsale.interface';
import { Store } from './store.interface';

export interface Cashbox {
  id: string;
  name: string;
  store: Store;
  storeId: string;
  sales: DocumentSale[];
  createdAt?: Date;
  updatedAt: Date;
}
