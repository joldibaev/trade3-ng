import {
  CreateDocumentPurchaseDto,
  CreateDocumentPurchaseItemInput,
} from './create-document-purchase.interface';

export interface UpdateDocumentPurchaseDto extends CreateDocumentPurchaseDto {
  items: CreateDocumentPurchaseItemInput[];
}
