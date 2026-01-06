import { DocumentReturn } from './documentreturn.interface';
import { DocumentSale } from './documentsale.interface';

export interface Client {
  id: string;
  name: string;
  sales: DocumentSale[];
  returns: DocumentReturn[];
  createdAt?: Date;
  updatedAt: Date;
}
