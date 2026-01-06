import { DocumentPurchase } from './documentpurchase.interface';

export interface Vendor {
  id: string;
  name: string;
  purchases: DocumentPurchase[];
  createdAt?: Date;
  updatedAt: Date;
}
