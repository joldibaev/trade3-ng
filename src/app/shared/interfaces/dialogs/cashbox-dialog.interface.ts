import { Cashbox } from '../entities/cashbox.interface';

export interface CashboxDialogData {
  cashbox?: Cashbox;
  storeId?: string;
}

export interface CashboxDialogResult {
  name: string;
  storeId: string;
}
