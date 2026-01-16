export interface CreateDocumentPurchaseItemDto {
  purchaseId: string;
  productId: string;
  quantity: number;
  price: number;
  total: number;
}
