import { Store } from '../entities/store.interface';

export interface StoreDialogData {
  store?: Store;
}

export interface StoreDialogResult {
  name: string;
}
