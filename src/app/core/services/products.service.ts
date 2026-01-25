import { httpResource } from '@angular/common/http';
import { Injectable, Signal } from '@angular/core';
import { Product } from '../../shared/interfaces/entities/product.interface';
import { BaseService } from './base.service';

@Injectable({ providedIn: 'root' })
export class ProductsService extends BaseService<Product> {
  protected apiUrl = '/api/products';

  search(query: Signal<string>) {
    return httpResource<Product[]>(() => {
      const q = query();
      if (!q) return undefined;
      return `${this.apiUrl}?query=${encodeURIComponent(q)}`;
    });
  }

  getLastPurchasePrice(id: string) {
    return this.http.get<number>(`${this.apiUrl}/${id}/last-purchase-price`);
  }
}
