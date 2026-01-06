import { Product } from './product.interface';

export interface Category {
  id: string;
  name: string;
  products: Product[];
  createdAt?: Date;
  updatedAt: Date;
}
