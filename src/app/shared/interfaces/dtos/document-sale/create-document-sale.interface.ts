import { DocumentStatus } from '../../constants';

export interface CreateDocumentSaleItemInput {
  productId?: string;
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
  notes?: string;
}

export interface CreateDocumentSaleItemsInput {
  items: CreateDocumentSaleItemInput[];
}

export interface RemoveDocumentSaleItemsInput {
  itemIds: string[];
}
