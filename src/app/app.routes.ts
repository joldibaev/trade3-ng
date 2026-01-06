import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: 'ui/demo',
    loadChildren: () => import('./features/ui-demo/routes').then((m) => m.routes),
  },
];
