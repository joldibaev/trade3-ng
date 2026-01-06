import { Barcode } from './barcode.interface';
import { Category } from './category.interface';
import { DocumentAdjustmentItem } from './documentadjustmentitem.interface';
import { DocumentPurchaseItem } from './documentpurchaseitem.interface';
import { DocumentReturnItem } from './documentreturnitem.interface';
import { DocumentSaleItem } from './documentsaleitem.interface';
import { DocumentTransferItem } from './documenttransferitem.interface';
import { Price } from './price.interface';
import { Stock } from './stock.interface';
import { StockMovement } from './stockmovement.interface';

export interface Product {
  id: string;
  name: string;
  article?: string;
  category: Category;
  categoryId: string;
  prices: Price[];
  stocks: Stock[];
  saleItems: DocumentSaleItem[];
  purchaseItems: DocumentPurchaseItem[];
  returnItems: DocumentReturnItem[];
  adjustmentItems: DocumentAdjustmentItem[];
  transferItems: DocumentTransferItem[];
  barcodes: Barcode[];
  movements: StockMovement[];
  createdAt?: Date;
  updatedAt: Date;
}
