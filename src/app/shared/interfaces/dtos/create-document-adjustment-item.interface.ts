export interface CreateDocumentAdjustmentItemDto {
  adjustmentId: string;
  productId: string;
  quantity: number;
  quantityBefore?: number;
  quantityAfter?: number;
}
