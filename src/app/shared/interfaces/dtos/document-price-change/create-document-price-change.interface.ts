import { DocumentStatus } from '../../constants';

export interface CreateDocumentPriceChangeItemInput {
  productId: string;
  priceTypeId: string;
  newValue: number;
}

export interface CreateDocumentPriceChangeDto {
  date: string;
  status?: DocumentStatus;
  notes?: string;
  items: CreateDocumentPriceChangeItemInput[];
}
