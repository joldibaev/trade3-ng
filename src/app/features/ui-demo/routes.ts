import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: 'button',
    loadComponent: () =>
      import('./ui-demo-button-page/ui-demo-button-page').then((m) => m.UiDemoButtonPage),
  },
  {
    path: 'input',
    loadComponent: () =>
      import('./ui-demo-input-page/ui-demo-input-page').then((m) => m.UiDemoInputPage),
  },
  {
    path: 'accordion',
    loadComponent: () =>
      import('./ui-demo-accordion-page/ui-demo-accordion-page').then((m) => m.UiDemoAccordionPage),
  },
  {
    path: 'menu',
    loadComponent: () =>
      import('./ui-demo-menu-page/ui-demo-menu-page').then((m) => m.UiDemoMenuPage),
  },
  {
    path: 'table',
    loadComponent: () =>
      import('./ui-demo-table-page/ui-demo-table-page').then((m) => m.UiDemoTablePage),
  },
];
