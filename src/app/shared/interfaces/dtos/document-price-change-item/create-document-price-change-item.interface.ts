export interface CreateDocumentPriceChangeItemDto {
  documentId: string;
  productId: string;
  priceTypeId: string;
  oldValue: number;
  newValue: number;
}
