import { Injectable } from '@angular/core';
import { BaseService } from './base.service';
import { Price } from '../../shared/interfaces/entities/price.interface';

@Injectable({ providedIn: 'root' })
export class PriceService extends BaseService<Price> {
    protected apiUrl = '/api/prices';
}
