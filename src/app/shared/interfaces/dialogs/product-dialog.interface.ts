import { Product } from '../entities/product.interface';

export interface ProductDialogData {
  product?: Product;
  categoryId?: string;
}

export interface ProductDialogResult {
  name: string;
  article: string;
  categoryId: string;
  barcodes: { id?: string; value: string }[];
}
