import { StockMovementType } from '../constants';

export interface CreateStockMovementDto {
  type: StockMovementType;
  storeId: string;
  productId: string;
  quantity: number;
  quantityAfter?: number;
  averagePurchasePrice?: number;
  documentPurchaseId?: string;
  documentSaleId?: string;
  documentReturnId?: string;
  documentAdjustmentId?: string;
  documentTransferId?: string;
}
