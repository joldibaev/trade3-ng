import { DocumentReturn } from './document-return.interface';
import { DocumentSale } from './document-sale.interface';

export interface Client {
  id: string;
  name: string;
  phone?: string;
  email?: string;
  address?: string;
  sales: DocumentSale[];
  returns: DocumentReturn[];
  createdAt?: string;
  updatedAt: string;
}
