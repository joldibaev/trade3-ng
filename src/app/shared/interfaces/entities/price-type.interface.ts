import { DocumentPurchaseItemPrice } from './document-purchase-item-price.interface';
import { DocumentSale } from './document-sale.interface';
import { PriceHistory } from './price-history.interface';
import { Price } from './price.interface';

export interface PriceType {
  id: string;
  name: string;
  priceHistory: PriceHistory[];
  prices: Price[];
  sales: DocumentSale[];
  documentPurchaseItemPrices: DocumentPurchaseItemPrice[];
  createdAt?: string;
  updatedAt: string;
}
