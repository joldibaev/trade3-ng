import { DocumentPurchase } from './document-purchase.interface';

export interface Vendor {
  id: string;
  name: string;
  purchases: DocumentPurchase[];
  createdAt?: Date;
  updatedAt: Date;
}
