import { Injectable } from '@angular/core';
import { BaseService } from './base.service';
import { Vendor } from '../../shared/interfaces/entities/vendor.interface';

@Injectable({ providedIn: 'root' })
export class VendorService extends BaseService<Vendor> {
    protected apiUrl = '/api/vendors';
}
