import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: 'purchases',
    loadComponent: () => import('./purchases-page/purchases-page').then((m) => m.PurchasesPage),
  },
  {
    path: 'sales',
    loadComponent: () => import('./sales-page/sales-page').then((m) => m.SalesPage),
  },
];
