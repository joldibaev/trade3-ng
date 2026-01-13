import { DocumentStatus } from '../constants';

export interface CreateDocumentAdjustmentItemDto {
  productId: string;
  quantity: number;
}

export interface CreateDocumentAdjustmentDto {
  storeId: string;
  date?: string;
  status?: DocumentStatus;
  items: CreateDocumentAdjustmentItemDto[];
}