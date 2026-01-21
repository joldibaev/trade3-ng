import { StockMovement } from './stock-movement.interface';

export interface User {
  id: string;
  username: string;
  createdAt?: string;
  updatedAt: string;
  deletedAt?: string;
  stockMovements: StockMovement[];
}
