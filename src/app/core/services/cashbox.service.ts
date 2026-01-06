import { Injectable } from '@angular/core';
import { BaseService } from './base.service';
import { Cashbox } from '../../shared/interfaces/entities/cashbox.interface';

@Injectable({ providedIn: 'root' })
export class CashboxService extends BaseService<Cashbox> {
    protected apiUrl = '/api/cashboxes';
}
