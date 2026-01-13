import { DocumentStatus } from '../constants';

export interface CreateDocumentReturnItemDto {
  productId: string;
  quantity: number;
  price?: number;
}

export interface CreateDocumentReturnDto {
  storeId: string;
  clientId?: string;
  date?: string;
  status?: DocumentStatus;
  items: CreateDocumentReturnItemDto[];
}