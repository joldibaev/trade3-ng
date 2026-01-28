// This file is auto-generated. Do not edit.

import { StockMovementType } from '../../constants';

export interface CreateStockLedgerDto {
  type: StockMovementType;
  storeId: string;
  productId: string;
  quantityBefore?: number;
  quantity: number;
  quantityAfter?: number;
  averagePurchasePrice?: number;
  transactionAmount?: number;
  batchId?: string;
  date?: string;
  documentPurchaseId?: string;
  documentSaleId?: string;
  documentReturnId?: string;
  documentAdjustmentId?: string;
  documentTransferId?: string;
}
