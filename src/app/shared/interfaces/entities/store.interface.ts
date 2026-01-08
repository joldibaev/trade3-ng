import { Cashbox } from './cashbox.interface';
import { DocumentAdjustment } from './document-adjustment.interface';
import { DocumentPurchase } from './document-purchase.interface';
import { DocumentReturn } from './document-return.interface';
import { DocumentSale } from './document-sale.interface';
import { DocumentTransfer } from './document-transfer.interface';
import { Stock } from './stock.interface';
import { StockMovement } from './stock-movement.interface';

export interface Store {
  id: string;
  name: string;
  cashboxes: Cashbox[];
  createdAt?: Date;
  updatedAt: Date;
  stocks: Stock[];
  sales: DocumentSale[];
  purchases: DocumentPurchase[];
  returns: DocumentReturn[];
  adjustments: DocumentAdjustment[];
  transfersFrom: DocumentTransfer[];
  transfersTo: DocumentTransfer[];
  movements: StockMovement[];
}
