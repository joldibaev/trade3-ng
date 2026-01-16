import { Barcode } from './barcode.interface';
import { Category } from './category.interface';
import { DocumentAdjustmentItem } from './document-adjustment-item.interface';
import { DocumentPurchaseItem } from './document-purchase-item.interface';
import { DocumentReturnItem } from './document-return-item.interface';
import { DocumentSaleItem } from './document-sale-item.interface';
import { DocumentTransferItem } from './document-transfer-item.interface';
import { PriceHistory } from './price-history.interface';
import { Price } from './price.interface';
import { StockMovement } from './stock-movement.interface';
import { Stock } from './stock.interface';

export interface Product {
  id: string;
  name: string;
  article?: string;
  category: Category;
  categoryId: string;
  prices: Price[];
  priceHistory: PriceHistory[];
  stocks: Stock[];
  saleItems: DocumentSaleItem[];
  purchaseItems: DocumentPurchaseItem[];
  returnItems: DocumentReturnItem[];
  adjustmentItems: DocumentAdjustmentItem[];
  transferItems: DocumentTransferItem[];
  barcodes: Barcode[];
  movements: StockMovement[];
  createdAt?: string;
  updatedAt: string;
}
