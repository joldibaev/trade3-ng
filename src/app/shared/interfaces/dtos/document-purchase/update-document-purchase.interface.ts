import { DocumentStatus } from '../../constants';
import { UpdateProductPriceInput } from './create-document-purchase.interface';

export interface UpdateDocumentPurchaseItemInput {
  productId: string;
  quantity: number;
  price: number;
  // This will fail if not imported
  newPrices?: UpdateProductPriceInput[];
}

export interface UpdateDocumentPurchaseDto {
  storeId: string;
  vendorId: string;
  date: string;
  status?: DocumentStatus;
  notes?: string;
  items?: UpdateDocumentPurchaseItemInput[];
}
