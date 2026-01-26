import { DocumentStatus } from '../../constants';

export interface CreateDocumentReturnItemInput {
  productId?: string;
  quantity: number;
  price?: number;
}

export interface CreateDocumentReturnDto {
  storeId: string;
  clientId?: string;
  date?: string;
  status?: DocumentStatus;
  notes?: string;
}

export interface CreateDocumentReturnItemsInput {
  items: CreateDocumentReturnItemInput[];
}

export interface RemoveDocumentReturnItemsInput {
  itemIds: string[];
}
