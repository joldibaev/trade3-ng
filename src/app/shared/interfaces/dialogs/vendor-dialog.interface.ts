import { Vendor } from '../entities/vendor.interface';

export interface VendorDialogData {
  vendor?: Vendor;
}

export interface VendorDialogResult {
  name: string;
  phone: string;
  email: string;
  address: string;
  isActive: boolean;
}
