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
    path: 'price-change',
    loadComponent: () =>
      import('./price-change-page/price-change-page').then((m) => m.PriceChangePage),
  },
];
