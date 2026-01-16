import { Injectable } from '@angular/core';
import { PriceHistory } from '../../shared/interfaces/entities/price-history.interface';
import { BaseService } from './base.service';

@Injectable({
  providedIn: 'root',
})
export class PriceHistoriesService extends BaseService<PriceHistory> {
  protected override apiUrl = '/api/price-histories';
}
