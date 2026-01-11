import { StockMovementType } from '../constants';
import { DocumentAdjustment } from './document-adjustment.interface';
import { DocumentPurchase } from './document-purchase.interface';
import { DocumentReturn } from './document-return.interface';
import { DocumentSale } from './document-sale.interface';
import { DocumentTransfer } from './document-transfer.interface';
import { Product } from './product.interface';
import { Store } from './store.interface';

export interface StockMovement {
  id: string;
  type: StockMovementType;
  store: Store;
  storeId: string;
  product: Product;
  productId: string;
  quantity: number;
  quantityAfter?: number;
  averagePurchasePrice?: number;
  date?: Date;
  createdAt?: Date;
  updatedAt: Date;
  documentPurchase?: DocumentPurchase;
  documentPurchaseId?: string;
  documentSale?: DocumentSale;
  documentSaleId?: string;
  documentReturn?: DocumentReturn;
  documentReturnId?: string;
  documentAdjustment?: DocumentAdjustment;
  documentAdjustmentId?: string;
  documentTransfer?: DocumentTransfer;
  documentTransferId?: string;
}
