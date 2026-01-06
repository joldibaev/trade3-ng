import { Injectable } from '@angular/core';
import { BaseService } from './base.service';
import { Category } from '../../shared/interfaces/entities/category.interface';

@Injectable({ providedIn: 'root' })
export class CategoryService extends BaseService<Category> {
    protected apiUrl = '/api/categories';
}
