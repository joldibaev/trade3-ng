import { Injectable } from '@angular/core';
import { Category } from '../../shared/interfaces/entities/category.interface';
import { BaseService } from './base.service';

@Injectable({ providedIn: 'root' })
export class CategoryService extends BaseService<Category> {
  protected apiUrl = '/api/categories';
}
