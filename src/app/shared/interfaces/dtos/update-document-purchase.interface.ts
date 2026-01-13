import {
  CreateDocumentPurchaseDto,
  CreateDocumentPurchaseItemDto,
} from './create-document-purchase.interface';

export interface UpdateDocumentPurchaseDto extends CreateDocumentPurchaseDto {
  items: CreateDocumentPurchaseItemDto[];
}
