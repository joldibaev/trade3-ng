import { Injectable } from '@angular/core';
import { Cashbox } from '../../shared/interfaces/entities/cashbox.interface';
import { BaseService } from './base.service';

@Injectable({ providedIn: 'root' })
export class CashboxService extends BaseService<Cashbox> {
  protected apiUrl = '/api/cashboxes';
}
