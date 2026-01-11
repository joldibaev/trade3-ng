export interface CreateDocumentSaleItemDto {
  saleId: string;
  productId: string;
  quantity: number;
  price: number;
  costPrice?: number;
  total: number;
}
