export interface CreateDocumentLedgerDto {
  action: string;
  details?: Record<string, unknown>;
  documentPurchaseId?: string;
  documentSaleId?: string;
  documentReturnId?: string;
  documentAdjustmentId?: string;
  documentTransferId?: string;
  documentPriceChangeId?: string;
}
