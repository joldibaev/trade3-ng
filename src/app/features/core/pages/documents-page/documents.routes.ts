import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: 'purchases',
    loadComponent: () => import('./purchases-page/purchases-page').then((m) => m.PurchasesPage),
  },
  {
    path: 'purchases/new',
    loadComponent: () =>
      import('./purchases-page/purchase-form/purchase-form').then((m) => m.PurchaseForm),
  },
  {
    path: 'purchases/:id',
    loadComponent: () =>
      import('./purchases-page/purchase-form/purchase-form').then((m) => m.PurchaseForm),
  },
  {
    path: 'sales',
    loadComponent: () => import('./sales-page/sales-page').then((m) => m.SalesPage),
  },
];
