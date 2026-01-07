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
    path: 'categories',
    loadComponent: () => import('./categories-page/categories-page').then((m) => m.CategoriesPage),
  },
  {
    path: 'products',
    loadComponent: () => import('./products-page/products-page').then((m) => m.ProductsPage),
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
