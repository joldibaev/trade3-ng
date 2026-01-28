// This file is auto-generated. Do not edit.

export const DocumentStatus = {
  DRAFT: 'DRAFT',
  COMPLETED: 'COMPLETED',
  CANCELLED: 'CANCELLED',
  SCHEDULED: 'SCHEDULED',
} as const;

export type DocumentStatus = (typeof DocumentStatus)[keyof typeof DocumentStatus];

export const Role = {
  ADMIN: 'ADMIN',
  MANAGER: 'MANAGER',
  CASHIER: 'CASHIER',
  USER: 'USER',
} as const;

export type Role = (typeof Role)[keyof typeof Role];

export const BarcodeType = {
  EAN13: 'EAN13',
  EAN8: 'EAN8',
  CODE128: 'CODE128',
  INTERNAL: 'INTERNAL',
  OTHER: 'OTHER',
} as const;

export type BarcodeType = (typeof BarcodeType)[keyof typeof BarcodeType];

export const StockMovementType = {
  PURCHASE: 'PURCHASE',
  SALE: 'SALE',
  RETURN: 'RETURN',
  ADJUSTMENT: 'ADJUSTMENT',
  TRANSFER_IN: 'TRANSFER_IN',
  TRANSFER_OUT: 'TRANSFER_OUT',
} as const;

export type StockMovementType = (typeof StockMovementType)[keyof typeof StockMovementType];
