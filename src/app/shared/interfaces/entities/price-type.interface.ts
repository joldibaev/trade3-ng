import { DocumentPriceChangeItem } from './document-price-change-item.interface';
import { DocumentSale } from './document-sale.interface';
import { PriceLedger } from './price-ledger.interface';
import { Price } from './price.interface';

export interface PriceType {
  id: string;
  name: string;
  priceLedger: PriceLedger[];
  prices: Price[];
  sales: DocumentSale[];
  priceChangeItems: DocumentPriceChangeItem[];
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}
