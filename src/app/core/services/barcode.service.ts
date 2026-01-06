import { Injectable } from '@angular/core';
import { BaseService } from './base.service';
import { Barcode } from '../../shared/interfaces/entities/barcode.interface';

@Injectable({ providedIn: 'root' })
export class BarcodeService extends BaseService<Barcode> {
    protected apiUrl = '/api/barcodes';
}
