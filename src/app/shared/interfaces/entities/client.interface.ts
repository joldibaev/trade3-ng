import { DocumentReturn } from './document-return.interface';
import { DocumentSale } from './document-sale.interface';

export interface Client {
  id: string;
  name: string;
  sales: DocumentSale[];
  returns: DocumentReturn[];
  createdAt?: Date;
  updatedAt: Date;
}
