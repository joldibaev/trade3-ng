import { DocumentStatus } from '../constants';
export interface CreateDocumentTransferItemDto {
  productId: string;
  quantity: number;
}
export interface CreateDocumentTransferDto {
  sourceStoreId: string;
  destinationStoreId: string;
  date?: string;
  status?: DocumentStatus;
  items: CreateDocumentTransferItemDto[];
}
