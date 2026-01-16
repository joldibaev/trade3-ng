import { Injectable } from '@angular/core';
import { StockMovement } from '../../shared/interfaces/entities/stock-movement.interface';
import { BaseService } from './base.service';

@Injectable({
  providedIn: 'root',
})
export class StockMovementsService extends BaseService<StockMovement> {
  protected override apiUrl = '/api/stock-movements';
}
