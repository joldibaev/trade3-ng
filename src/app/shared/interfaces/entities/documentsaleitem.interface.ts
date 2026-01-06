import { DocumentSale } from './documentsale.interface';
import { Product } from './product.interface';

export interface DocumentSaleItem {
  id: string;
  sale: DocumentSale;
  saleId: string;
  product: Product;
  productId: string;
  quantity: number;
  price: number;
  costPrice?: number;
  total: number;
  createdAt?: Date;
  updatedAt: Date;
}
