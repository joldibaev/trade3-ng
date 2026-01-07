import { Routes } from '@angular/router';
import { UiDemo } from './ui-demo';

export const routes: Routes = [
  { path: '', redirectTo: 'demo', pathMatch: 'full' },
  {
    path: 'demo',
    component: UiDemo,
    children: [
      {
        path: 'button',
        loadComponent: () =>
          import('./pages/ui-demo-button-page/ui-demo-button-page').then((m) => m.UiDemoButtonPage),
      },
      {
        path: 'input',
        loadComponent: () =>
          import('./pages/ui-demo-input-page/ui-demo-input-page').then((m) => m.UiDemoInputPage),
      },
      {
        path: 'accordion',
        loadComponent: () =>
          import('./pages/ui-demo-accordion-page/ui-demo-accordion-page').then(
            (m) => m.UiDemoAccordionPage,
          ),
      },
      {
        path: 'menu',
        loadComponent: () =>
          import('./pages/ui-demo-menu-page/ui-demo-menu-page').then((m) => m.UiDemoMenuPage),
      },
      {
        path: 'table',
        loadComponent: () =>
          import('./pages/ui-demo-table-page/ui-demo-table-page').then((m) => m.UiDemoTablePage),
      },
    ],
  },
];
