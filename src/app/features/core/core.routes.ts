import { Routes } from '@angular/router';
import { Core } from './core';
import { DashboardPage } from './pages/dashboard-page/dashboard-page';

export const routes: Routes = [
  {
    path: '',
    component: Core,
    children: [
      { path: '', redirectTo: 'dashboard', pathMatch: 'full' },
      { path: 'dashboard', component: DashboardPage },
      {
        path: 'directories',
        loadChildren: () =>
          import('./pages/directories-page/directories.routes').then((m) => m.routes),
      },
      {
        path: 'documents',
        loadChildren: () => import('./pages/documents-page/documents.routes').then((m) => m.routes),
      },
    ],
  },
];
