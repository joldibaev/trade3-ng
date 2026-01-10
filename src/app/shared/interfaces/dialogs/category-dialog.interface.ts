import { Category } from '../entities/category.interface';

export interface CategoryDialogData {
  category?: Category;
}

export interface CategoryDialogResult {
  name: string;
}
