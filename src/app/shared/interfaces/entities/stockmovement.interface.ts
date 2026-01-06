import { DocumentAdjustment } from './documentadjustment.interface';
import { DocumentPurchase } from './documentpurchase.interface';
import { DocumentReturn } from './documentreturn.interface';
import { DocumentSale } from './documentsale.interface';
import { DocumentTransfer } from './documenttransfer.interface';
import { Product } from './product.interface';
import { StockMovementType } from './constants';
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
