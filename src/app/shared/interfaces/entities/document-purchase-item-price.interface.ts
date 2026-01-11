import { DocumentPurchaseItem } from './document-purchase-item.interface';
import { PriceType } from './price-type.interface';

export interface DocumentPurchaseItemPrice {
  id: string;
  item: DocumentPurchaseItem;
  itemId: string;
  priceType: PriceType;
  priceTypeId: string;
  value: number;
  createdAt?: Date;
  updatedAt: Date;
}
