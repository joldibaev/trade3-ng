// This file is auto-generated. Do not edit.

import { Product } from './product.interface';
import { Store } from './store.interface';

export interface Stock {
  id: string;
  quantity: number;
  averagePurchasePrice: number;
  product: Product;
  productId: string;
  store: Store;
  storeId: string;
  createdAt: string;
  updatedAt: string;
}
