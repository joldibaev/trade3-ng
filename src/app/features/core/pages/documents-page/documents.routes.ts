import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: 'purchases',
    loadComponent: () => import('./purchases-page/purchases-page').then((m) => m.PurchasesPage),
  },
];
