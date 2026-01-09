import { DocumentStatus } from '../entities/constants';

export interface CreateDocumentPurchaseDto {
  date?: Date;
  vendorId?: string;
  storeId: string;
  status?: DocumentStatus;
  items: {
    productId: string;
    quantity: number;
    price: number;
    prices?: {
      priceTypeId: string;
      value: number;
    }[];
  }[];
}
