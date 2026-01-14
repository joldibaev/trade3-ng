import { DocumentPurchase } from './document-purchase.interface';
import { PriceType } from './price-type.interface';
import { Product } from './product.interface';

export interface PriceHistory {
  id: string;
  value: number;
  product: Product;
  productId: string;
  priceType: PriceType;
  priceTypeId: string;
  documentPurchase?: DocumentPurchase;
  documentPurchaseId?: string;
  createdAt?: Date;
  updatedAt: Date;
}
