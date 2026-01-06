import { Injectable } from '@angular/core';
import { Barcode } from '../../shared/interfaces/entities/barcode.interface';
import { BaseService } from './base.service';

@Injectable({ providedIn: 'root' })
export class BarcodeService extends BaseService<Barcode> {
  protected apiUrl = '/api/barcodes';
}
