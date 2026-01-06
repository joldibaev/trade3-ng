import { DocumentPurchase } from './document-purchase.interface';
import { Product } from './product.interface';

export interface DocumentPurchaseItem {
  id: string;
  purchase: DocumentPurchase;
  purchaseId: string;
  product: Product;
  productId: string;
  quantity: number;
  price: number;
  total: number;
  createdAt?: Date;
  updatedAt: Date;
}
