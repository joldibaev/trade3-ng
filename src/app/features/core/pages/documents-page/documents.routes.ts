import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: 'purchases',
    loadComponent: () => import('./purchases-page/purchases-page').then((m) => m.PurchasesPage),
  },
  {
    path: 'purchases/:id',
    loadComponent: () =>
      import('./purchases-page/purchase-details-page/purchase-details-page').then(
        (m) => m.PurchaseDetailsPage,
      ),
  },
  {
    path: 'purchases/:id/edit',
    loadComponent: () =>
      import('./purchases-page/purchase-edit-page/purchase-edit-page').then(
        (m) => m.PurchaseEditPage,
      ),
  },
];
