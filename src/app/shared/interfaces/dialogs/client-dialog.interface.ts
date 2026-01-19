import { Client } from '../entities/client.interface';

export interface ClientDialogData {
  client?: Client;
}

export interface ClientDialogResult {
  name: string;
  phone: string;
  email: string;
  address: string;
  isActive: boolean;
}
