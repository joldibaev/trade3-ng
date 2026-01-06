import { Injectable } from '@angular/core';
import { PriceType } from '../../shared/interfaces/entities/price-type.interface';
import { BaseService } from './base.service';

@Injectable({ providedIn: 'root' })
export class PriceTypeService extends BaseService<PriceType> {
  protected apiUrl = '/api/price-types';
}
