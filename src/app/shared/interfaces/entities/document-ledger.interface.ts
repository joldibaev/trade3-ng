import { DocumentAdjustment } from './document-adjustment.interface';
import { DocumentPriceChange } from './document-price-change.interface';
import { DocumentPurchase } from './document-purchase.interface';
import { DocumentReturn } from './document-return.interface';
import { DocumentSale } from './document-sale.interface';
import { DocumentTransfer } from './document-transfer.interface';

export interface DocumentLedger {
  id: string;
  action: string;
  details?: Record<string, unknown>;
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
  documentPriceChange?: DocumentPriceChange;
  documentPriceChangeId?: string;
  date?: string;
  createdAt?: string;
  updatedAt?: string;
}
