import { InventoryReprocessing } from './inventory-reprocessing.interface';
import { Product } from './product.interface';
import { Store } from './store.interface';

export interface InventoryReprocessingItem {
  id: string;
  reprocessing: InventoryReprocessing;
  reprocessingId: string;
  product: Product;
  productId: string;
  store: Store;
  storeId: string;
  oldAveragePurchasePrice: number;
  newAveragePurchasePrice: number;
  oldQuantity: number;
  newQuantity: number;
  affectedLedgerCount: number;
  createdAt?: string;
  updatedAt: string;
}
