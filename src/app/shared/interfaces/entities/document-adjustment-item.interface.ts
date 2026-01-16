import { DocumentAdjustment } from './document-adjustment.interface';
import { Product } from './product.interface';

export interface DocumentAdjustmentItem {
  id: string;
  adjustment: DocumentAdjustment;
  adjustmentId: string;
  product: Product;
  productId: string;
  quantity: number;
  quantityBefore?: number;
  quantityAfter?: number;
  createdAt?: string;
  updatedAt: string;
}
