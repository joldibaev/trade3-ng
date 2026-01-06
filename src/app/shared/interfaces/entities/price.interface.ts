import { PriceType } from './price-type.interface';
import { Product } from './product.interface';

export interface Price {
  id: string;
  value: number;
  product: Product;
  productId: string;
  priceType: PriceType;
  priceTypeId: string;
  createdAt?: Date;
  updatedAt: Date;
}
