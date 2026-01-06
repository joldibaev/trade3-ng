import { Cashbox } from './cashbox.interface';
import { DocumentAdjustment } from './documentadjustment.interface';
import { DocumentPurchase } from './documentpurchase.interface';
import { DocumentReturn } from './documentreturn.interface';
import { DocumentSale } from './documentsale.interface';
import { DocumentTransfer } from './documenttransfer.interface';
import { Stock } from './stock.interface';
import { StockMovement } from './stockmovement.interface';

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
