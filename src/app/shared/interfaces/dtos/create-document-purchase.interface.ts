export interface UpdateProductPriceDto {
  priceTypeId: string;
  value: number;
}

export interface CreateDocumentPurchaseItemDto {
  productId: string;
  quantity: number;
  price: number; // Cost price is mandatory for Purchase
  newPrices: UpdateProductPriceDto[];
}

export interface CreateDocumentPurchaseDto {
  storeId: string;
  vendorId: string;
  date: string;
}
