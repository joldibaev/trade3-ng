import { Injectable } from '@angular/core';
import { Price } from '../../shared/interfaces/entities/price.interface';
import { BaseService } from './base.service';

@Injectable({ providedIn: 'root' })
export class PriceService extends BaseService<Price> {
  protected apiUrl = '/api/prices';
}
