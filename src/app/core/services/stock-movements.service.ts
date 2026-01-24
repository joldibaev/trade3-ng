import { Injectable } from '@angular/core';
import { StockLedger } from '../../shared/interfaces/entities/stock-ledger.interface';
import { BaseService } from './base.service';

@Injectable({
  providedIn: 'root',
})
export class StockMovementsService extends BaseService<StockLedger> {
  protected override apiUrl = '/api/stock-movements';
}
