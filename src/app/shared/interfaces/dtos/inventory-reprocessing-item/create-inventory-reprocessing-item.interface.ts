export interface CreateInventoryReprocessingItemDto {
  reprocessingId: string;
  productId: string;
  storeId: string;
  oldAveragePurchasePrice: number;
  newAveragePurchasePrice: number;
  oldQuantity: number;
  newQuantity: number;
  affectedLedgerCount: number;
}
