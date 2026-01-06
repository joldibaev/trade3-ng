import { Injectable } from '@angular/core';
import { BaseService } from './base.service';
import { PriceType } from '../../shared/interfaces/entities/pricetype.interface';

@Injectable({ providedIn: 'root' })
export class PriceTypeService extends BaseService<PriceType> {
    protected apiUrl = '/api/price-types';
}
