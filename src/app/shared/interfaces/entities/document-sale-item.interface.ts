// This file is auto-generated. Do not edit.

import { DocumentSale } from './document-sale.interface';
import { Product } from './product.interface';

export interface DocumentSaleItem {
  id: string;
  sale: DocumentSale;
  saleId: string;
  product: Product;
  productId: string;
  quantity: number;
  price: number;
  costPrice: number;
  total: number;
  createdAt: string;
  updatedAt: string;
}
