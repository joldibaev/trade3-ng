export interface CreatePriceHistoryDto {
  value: number;
  productId: string;
  priceTypeId: string;
  documentPurchaseId?: string;
}
