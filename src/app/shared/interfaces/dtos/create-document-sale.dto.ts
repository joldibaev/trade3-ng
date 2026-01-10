import { DocumentStatus } from '../entities/constants';

export interface CreateDocumentSaleDto {
  date?: Date;
  storeId: string;
  cashboxId?: string;
  clientId?: string;
  priceTypeId?: string;
  status?: DocumentStatus;
  items: {
    productId: string;
    quantity: number;
    price: number;
  }[];
}
