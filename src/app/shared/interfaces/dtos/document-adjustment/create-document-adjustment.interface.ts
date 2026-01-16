import { DocumentStatus } from '../../constants';

export interface CreateDocumentAdjustmentItemInput {
  productId: string;
  quantity: number;
}

export interface CreateDocumentAdjustmentDto {
  storeId: string;
  date?: string;
  status?: DocumentStatus;
  items: CreateDocumentAdjustmentItemInput[];
}
