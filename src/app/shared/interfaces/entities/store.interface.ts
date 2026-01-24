import { Cashbox } from './cashbox.interface';
import { DocumentAdjustment } from './document-adjustment.interface';
import { DocumentPurchase } from './document-purchase.interface';
import { DocumentReturn } from './document-return.interface';
import { DocumentSale } from './document-sale.interface';
import { DocumentTransfer } from './document-transfer.interface';
import { InventoryReprocessingItem } from './inventory-reprocessing-item.interface';
import { StockLedger } from './stock-ledger.interface';
import { Stock } from './stock.interface';

export interface Store {
  id: string;
  name: string;
  address?: string;
  phone?: string;
  workingHours?: string;
  isActive: boolean;
  cashboxes: Cashbox[];
  createdAt: string;
  updatedAt: string;
  stocks: Stock[];
  sales: DocumentSale[];
  purchases: DocumentPurchase[];
  returns: DocumentReturn[];
  adjustments: DocumentAdjustment[];
  transfersFrom: DocumentTransfer[];
  transfersTo: DocumentTransfer[];
  stockLedger: StockLedger[];
  inventoryReprocessingItems: InventoryReprocessingItem[];
}
