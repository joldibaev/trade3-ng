// This file is auto-generated. Do not edit.

import { Role } from '../constants';
import { DocumentAdjustment } from './document-adjustment.interface';
import { DocumentHistory } from './document-history.interface';
import { DocumentPriceChange } from './document-price-change.interface';
import { DocumentPurchase } from './document-purchase.interface';
import { DocumentReturn } from './document-return.interface';
import { DocumentSale } from './document-sale.interface';
import { DocumentTransfer } from './document-transfer.interface';

export interface User {
  id: string;
  email: string;
  passwordHash: string;
  refreshTokenHash?: string;
  role: Role;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
  createdSales: DocumentSale[];
  createdPurchases: DocumentPurchase[];
  createdReturns: DocumentReturn[];
  createdAdjustments: DocumentAdjustment[];
  createdTransfers: DocumentTransfer[];
  createdPriceChanges: DocumentPriceChange[];
  createdHistory: DocumentHistory[];
}
