import { DocumentReturn } from './document-return.interface';
import { Product } from './product.interface';

export interface DocumentReturnItem {
  id: string;
  return: DocumentReturn;
  returnId: string;
  product: Product;
  productId: string;
  quantity: number;
  price: number;
  total: number;
  createdAt?: Date;
  updatedAt: Date;
}
