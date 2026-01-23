export interface CreateInventoryReprocessingDto {
  status: string;
  documentPurchaseId?: string;
  documentSaleId?: string;
  documentReturnId?: string;
  documentAdjustmentId?: string;
  documentTransferId?: string;
}
