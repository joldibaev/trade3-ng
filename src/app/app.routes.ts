import { Routes } from '@angular/router';

export const routes: Routes = [
  { path: '', redirectTo: 'core', pathMatch: 'full' },
  {
    path: 'core',
    loadChildren: () => import('./features/core/core.routes').then((m) => m.routes),
  },
];
