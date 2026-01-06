import { DocumentAdjustment } from './documentadjustment.interface';
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
  createdAt?: Date;
  updatedAt: Date;
}
