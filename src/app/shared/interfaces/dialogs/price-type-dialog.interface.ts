import { PriceType } from '../entities/price-type.interface';

export interface PriceTypeDialogData {
  priceType?: PriceType;
}

export interface PriceTypeDialogResult {
  name: string;
  isActive: boolean;
}
