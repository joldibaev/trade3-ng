import { DocumentStatus } from '../../constants';

export interface UpdateProductPriceInput {
  priceTypeId: string;
  value: number;
}

export interface CreateDocumentPurchaseItemInput {
  productId: string;
  quantity: number;
  price: number; // Cost price is mandatory for Purchase
  newPrices: UpdateProductPriceInput[];
}

export interface CreateDocumentPurchaseDto {
  storeId: string;
  vendorId: string;
  date: string;
  status?: DocumentStatus;
  notes?: string;
  items?: CreateDocumentPurchaseItemInput[];
}
