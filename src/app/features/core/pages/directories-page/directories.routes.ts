import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: 'stores',
    loadComponent: () => import('./stores-page/stores-page').then((m) => m.StoresPage),
    title: 'Магазины',
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
  {
    path: 'price-types',
    loadComponent: () =>
      import('./price-types-page/price-types-page').then((m) => m.PriceTypesPage),
    title: 'Типы цен',
  },
];
