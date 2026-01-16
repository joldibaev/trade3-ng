import { DocumentTransfer } from './document-transfer.interface';
import { Product } from './product.interface';

export interface DocumentTransferItem {
  id: string;
  transfer: DocumentTransfer;
  transferId: string;
  product: Product;
  productId: string;
  quantity: number;
  createdAt?: string;
  updatedAt: string;
}
