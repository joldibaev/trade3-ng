// This file is auto-generated. Do not edit.

import { DocumentStatus } from '../constants';
import { Client } from './client.interface';
import { DocumentHistory } from './document-history.interface';
import { DocumentReturnItem } from './document-return-item.interface';
import { StockLedger } from './stock-ledger.interface';
import { Store } from './store.interface';
import { User } from './user.interface';

export interface DocumentReturn {
  id: string;
  code: string;
  date: string;
  store: Store;
  storeId: string;
  client?: Client;
  clientId?: string;
  total: number;
  items: DocumentReturnItem[];
  status: DocumentStatus;
  notes?: string;
  createdAt: string;
  updatedAt: string;
  stockLedger: StockLedger[];
  documentHistory: DocumentHistory[];
  author?: User;
  authorId?: string;
}
