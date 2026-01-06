import { Injectable } from '@angular/core';
import { Vendor } from '../../shared/interfaces/entities/vendor.interface';
import { BaseService } from './base.service';

@Injectable({ providedIn: 'root' })
export class VendorService extends BaseService<Vendor> {
  protected apiUrl = '/api/vendors';
}
