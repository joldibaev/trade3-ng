import { Injectable } from '@angular/core';
import { Store } from '../../shared/interfaces/entities/store.interface';
import { BaseService } from './base.service';

@Injectable({ providedIn: 'root' })
export class StoreService extends BaseService<Store> {
  protected apiUrl = '/api/stores';
}
