import { DocumentAdjustment } from './document-adjustment.interface';
import { DocumentPurchase } from './document-purchase.interface';
import { DocumentReturn } from './document-return.interface';
import { DocumentSale } from './document-sale.interface';
import { DocumentTransfer } from './document-transfer.interface';

export interface DocumentHistory {
  id: string;
  action: string;
  details?: Record<string, unknown>;
  userId?: string;
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
  createdAt?: string;
}
