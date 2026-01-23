export interface CreatePriceLedgerDto {
  valueBefore?: number;
  value: number;
  productId: string;
  priceTypeId: string;
  documentPriceChangeId?: string;
  batchId?: string;
}
