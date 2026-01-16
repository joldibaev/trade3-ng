import { Routes } from '@angular/router';

export const routes: Routes = [
  { path: '', redirectTo: 'core', pathMatch: 'full' },
  {
    path: 'core',
    loadChildren: () => import('./features/core/core.routes').then((m) => m.routes),
  },
  {
    path: 'ui',
    loadComponent: () =>
      import('./features/ui-demo/layout/ui-demo-layout').then((m) => m.UiDemoLayout),
    children: [
      {
        path: 'demo',
        loadChildren: () => import('./features/ui-demo/ui-demo.routes').then((m) => m.routes),
      },
    ],
  },
];
