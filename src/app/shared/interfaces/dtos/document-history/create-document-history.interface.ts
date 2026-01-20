export interface CreateDocumentHistoryDto {
  action: string;
  details?: Record<string, unknown>;
  userId?: string;
  documentPurchaseId?: string;
  documentSaleId?: string;
  documentReturnId?: string;
  documentAdjustmentId?: string;
  documentTransferId?: string;
}
