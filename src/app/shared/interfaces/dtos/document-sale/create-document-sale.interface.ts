import { DocumentStatus } from '../../constants';

export interface CreateDocumentSaleItemInput {
  productId: string;
  quantity: number;
  price?: number;
}

export interface CreateDocumentSaleDto {
  storeId: string;
  cashboxId: string;
  clientId?: string;
  priceTypeId?: string;
  date?: string;
  status?: DocumentStatus;
  items?: CreateDocumentSaleItemInput[];
}
