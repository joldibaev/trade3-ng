import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: 'stores',
    loadComponent: () => import('./stores-page/stores-page').then((m) => m.StoresPage),
    title: 'Магазины',
  },
  {
    path: 'stores/:storeId/cashboxes',
    loadComponent: () => import('./cashboxes-page/cashboxes-page').then((m) => m.CashboxesPage),
    title: 'Кассы',
  },
  {
    path: 'nomenclature',
    loadComponent: () =>
      import('./nomenclature-page/nomenclature-page').then((m) => m.NomenclaturePage),
    title: 'Номенклатура',
  },
  {
    path: 'clients',
    loadComponent: () => import('./clients-page/clients-page').then((m) => m.ClientsPage),
  },
  {
    path: 'vendors',
    loadComponent: () => import('./vendors-page/vendors-page').then((m) => m.VendorsPage),
  },
];
