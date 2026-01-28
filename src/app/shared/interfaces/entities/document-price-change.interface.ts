// This file is auto-generated. Do not edit.

import { DocumentStatus } from '../constants';
import { DocumentHistory } from './document-history.interface';
import { DocumentPriceChangeItem } from './document-price-change-item.interface';
import { DocumentPurchase } from './document-purchase.interface';
import { PriceLedger } from './price-ledger.interface';
import { User } from './user.interface';

export interface DocumentPriceChange {
  id: string;
  code: string;
  date: string;
  status: DocumentStatus;
  notes?: string;
  items: DocumentPriceChangeItem[];
  createdAt: string;
  updatedAt: string;
  documentHistory: DocumentHistory[];
  generatedPriceLedger: PriceLedger[];
  documentPurchase?: DocumentPurchase;
  documentPurchaseId?: string;
  author?: User;
  authorId?: string;
}
