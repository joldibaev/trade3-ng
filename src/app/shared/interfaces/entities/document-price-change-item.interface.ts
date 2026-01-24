import { DocumentPriceChange } from './document-price-change.interface';
import { PriceType } from './price-type.interface';
import { Product } from './product.interface';

export interface DocumentPriceChangeItem {
  id: string;
  document: DocumentPriceChange;
  documentId: string;
  product: Product;
  productId: string;
  priceType: PriceType;
  priceTypeId: string;
  oldValue: number;
  newValue: number;
  createdAt: string;
  updatedAt: string;
}
