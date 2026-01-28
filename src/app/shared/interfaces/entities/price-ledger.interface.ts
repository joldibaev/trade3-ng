// This file is auto-generated. Do not edit.

import { DocumentPriceChange } from './document-price-change.interface';
import { PriceType } from './price-type.interface';
import { Product } from './product.interface';

export interface PriceLedger {
  id: string;
  valueBefore: number;
  value: number;
  product: Product;
  productId: string;
  priceType: PriceType;
  priceTypeId: string;
  documentPriceChange?: DocumentPriceChange;
  documentPriceChangeId?: string;
  batchId?: string;
  date: string;
  createdAt: string;
  updatedAt: string;
}
