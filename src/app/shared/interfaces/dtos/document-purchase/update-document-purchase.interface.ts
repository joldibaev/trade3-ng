import { DocumentStatus } from '../../constants';

export interface UpdateDocumentPurchaseItemInput {
  productId: string;
  quantity: number;
  price: number;
}

export interface UpdateDocumentPurchaseDto {
  storeId: string;
  vendorId: string;
  date: string;
  status?: DocumentStatus;
  notes?: string;
  items?: UpdateDocumentPurchaseItemInput[];
}
