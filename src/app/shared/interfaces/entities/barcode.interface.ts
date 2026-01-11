import { BarcodeType } from '../constants';
import { Product } from './product.interface';

export interface Barcode {
  id: string;
  value: string;
  type?: BarcodeType;
  product: Product;
  productId: string;
  createdAt?: Date;
  updatedAt: Date;
}
