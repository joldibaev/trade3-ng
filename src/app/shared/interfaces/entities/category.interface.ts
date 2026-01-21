import { Product } from './product.interface';

export interface Category {
  id: string;
  name: string;
  products: Product[];
  parent?: Category;
  parentId?: string;
  children: Category[];
  isActive?: boolean;
  createdAt?: string;
  updatedAt: string;
  deletedAt?: string;
}
