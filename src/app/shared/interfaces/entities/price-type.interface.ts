import { DocumentSale } from './document-sale.interface';
import { Price } from './price.interface';

export interface PriceType {
  id: string;
  name: string;
  prices: Price[];
  sales: DocumentSale[];
  createdAt?: Date;
  updatedAt: Date;
}
