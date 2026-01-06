import { Injectable } from '@angular/core';
import { BaseService } from './base.service';
import { Store } from '../../shared/interfaces/entities/store.interface';

@Injectable({ providedIn: 'root' })
export class StoreService extends BaseService<Store> {
    protected apiUrl = '/api/stores';
}
