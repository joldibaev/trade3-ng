import { DocumentPurchase } from './document-purchase.interface';

export interface Vendor {
  id: string;
  name: string;
  phone?: string;
  email?: string;
  address?: string;
  purchases: DocumentPurchase[];
  isActive?: boolean;
  createdAt?: string;
  updatedAt: string;
}
