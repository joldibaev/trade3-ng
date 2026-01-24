import { Barcode } from './barcode.interface';
import { Category } from './category.interface';
import { DocumentAdjustmentItem } from './document-adjustment-item.interface';
import { DocumentPriceChangeItem } from './document-price-change-item.interface';
import { DocumentPurchaseItem } from './document-purchase-item.interface';
import { DocumentReturnItem } from './document-return-item.interface';
import { DocumentSaleItem } from './document-sale-item.interface';
import { DocumentTransferItem } from './document-transfer-item.interface';
import { InventoryReprocessingItem } from './inventory-reprocessing-item.interface';
import { PriceLedger } from './price-ledger.interface';
import { Price } from './price.interface';
import { StockLedger } from './stock-ledger.interface';
import { Stock } from './stock.interface';

export interface Product {
  id: string;
  code: string;
  name: string;
  article?: string;
  category: Category;
  categoryId: string;
  prices: Price[];
  priceLedger: PriceLedger[];
  stocks: Stock[];
  saleItems: DocumentSaleItem[];
  purchaseItems: DocumentPurchaseItem[];
  returnItems: DocumentReturnItem[];
  adjustmentItems: DocumentAdjustmentItem[];
  transferItems: DocumentTransferItem[];
  priceChangeItems: DocumentPriceChangeItem[];
  barcodes: Barcode[];
  stockLedger: StockLedger[];
  inventoryReprocessingItems: InventoryReprocessingItem[];
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}
