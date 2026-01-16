export interface CreateStockDto {
  quantity?: number;
  averagePurchasePrice?: number;
  productId: string;
  storeId: string;
}
