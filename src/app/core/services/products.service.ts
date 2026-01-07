import { Injectable } from '@angular/core';
import { Product } from '../../shared/interfaces/entities/product.interface';
import { BaseService } from './base.service';

@Injectable({ providedIn: 'root' })
export class ProductsService extends BaseService<Product> {
  protected apiUrl = '/api/products';
}
