import { Injectable } from '@angular/core';
import { BaseService } from './base.service';
import { Product } from '../../shared/interfaces/entities/product.interface';

@Injectable({ providedIn: 'root' })
export class ProductService extends BaseService<Product> {
    protected apiUrl = '/api/products';
}
