// This file is auto-generated. Do not edit.

import { DocumentStatus } from '../../constants';
import { CreateDocumentPriceChangeItemDto } from './create-document-price-change-item.interface';

export interface CreateDocumentPriceChangeDto {
  date: string;
  status?: DocumentStatus;
  notes?: string;
  items: CreateDocumentPriceChangeItemDto[];
}
