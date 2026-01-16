import { Routes } from '@angular/router';
import { UiDemoIndexPage } from './pages/ui-demo-index/ui-demo-index';

export const routes: Routes = [
  { path: '', component: UiDemoIndexPage },
  {
    path: 'button',
    loadComponent: () => import('./pages/demo-button/demo-button').then((m) => m.DemoButtonPage),
  },
  {
    path: 'badge',
    loadComponent: () => import('./pages/demo-badge/demo-badge').then((m) => m.DemoBadgePage),
  },
  {
    path: 'card',
    loadComponent: () => import('./pages/demo-card/demo-card').then((m) => m.DemoCardPage),
  },
  {
    path: 'loading',
    loadComponent: () => import('./pages/demo-loading/demo-loading').then((m) => m.DemoLoadingPage),
  },
  {
    path: 'input',
    loadComponent: () => import('./pages/demo-input/demo-input').then((m) => m.DemoInputPage),
  },
  {
    path: 'select',
    loadComponent: () => import('./pages/demo-select/demo-select').then((m) => m.DemoSelectPage),
  },
  {
    path: 'autocomplete',
    loadComponent: () =>
      import('./pages/demo-autocomplete/demo-autocomplete').then((m) => m.DemoAutocompletePage),
  },
  {
    path: 'table',
    loadComponent: () => import('./pages/demo-table/demo-table').then((m) => m.DemoTablePage),
  },
  {
    path: 'notyf',
    loadComponent: () => import('./pages/demo-notyf/demo-notyf').then((m) => m.DemoNotyfPage),
  },
  {
    path: 'dialog',
    loadComponent: () => import('./pages/demo-dialog/demo-dialog').then((m) => m.DemoDialogPage),
  },
  {
    path: 'accordion',
    loadComponent: () =>
      import('./pages/demo-accordion/demo-accordion').then((m) => m.DemoAccordionPage),
  },
  {
    path: 'breadcrumb',
    loadComponent: () =>
      import('./pages/demo-breadcrumb/demo-breadcrumb').then((m) => m.DemoBreadcrumbPage),
  },
  {
    path: 'directory-item-card',
    loadComponent: () =>
      import('./pages/demo-directory-item-card/demo-directory-item-card').then(
        (m) => m.DemoDirectoryItemCardPage,
      ),
  },
  {
    path: 'empty-state',
    loadComponent: () =>
      import('./pages/demo-empty-state/demo-empty-state').then((m) => m.DemoEmptyStatePage),
  },
  {
    path: 'menu',
    loadComponent: () => import('./pages/demo-menu/demo-menu').then((m) => m.DemoMenuPage),
  },
  {
    path: 'page-header',
    loadComponent: () =>
      import('./pages/demo-page-header/demo-page-header').then((m) => m.DemoPageHeaderPage),
  },
  {
    path: 'tree',
    loadComponent: () => import('./pages/demo-tree/demo-tree').then((m) => m.DemoTreePage),
  },
  {
    path: 'tabs',
    loadComponent: () => import('./pages/demo-tabs/demo-tabs').then((m) => m.DemoTabsPage),
  },
];
