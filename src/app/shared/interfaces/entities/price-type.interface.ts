import { DocumentPurchaseItemPrice } from './document-purchase-item-price.interface';
import { DocumentSale } from './document-sale.interface';
import { Price } from './price.interface';

export interface PriceType {
  id: string;
  name: string;
  prices: Price[];
  sales: DocumentSale[];
  documentPurchaseItemPrices: DocumentPurchaseItemPrice[];
  createdAt?: Date;
  updatedAt: Date;
}
