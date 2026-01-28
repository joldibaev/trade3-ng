// This file is auto-generated. Do not edit.

import { DocumentAdjustment } from './document-adjustment.interface';
import { DocumentPurchase } from './document-purchase.interface';
import { DocumentReturn } from './document-return.interface';
import { DocumentSale } from './document-sale.interface';
import { DocumentTransfer } from './document-transfer.interface';
import { InventoryReprocessingItem } from './inventory-reprocessing-item.interface';

export interface InventoryReprocessing {
  id: string;
  date: string;
  status: string;
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
  items: InventoryReprocessingItem[];
  createdAt: string;
  updatedAt: string;
}
