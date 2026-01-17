import { ChangeDetectionStrategy, Component } from '@angular/core';
import { RouterLink, RouterLinkActive, RouterOutlet } from '@angular/router';
import { UiIcon } from '../../../core/ui/ui-icon/ui-icon.component';

@Component({
  selector: 'app-ui-demo-layout',
  standalone: true,
  imports: [RouterOutlet, RouterLink, RouterLinkActive, UiIcon],
  templateUrl: './ui-demo-layout.html',
  styles: [
    `
      :host {
        display: block;
      }
    `,
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class UiDemoLayout {
  menuItems = [
    { label: 'Accordion', path: '/ui/demo/accordion' },
    { label: 'Autocomplete', path: '/ui/demo/autocomplete' },
    { label: 'Badge', path: '/ui/demo/badge' },
    { label: 'Breadcrumb', path: '/ui/demo/breadcrumb' },
    { label: 'Button', path: '/ui/demo/button' },
    { label: 'Card', path: '/ui/demo/card' },
    { label: 'Dialog', path: '/ui/demo/dialog' },
    { label: 'Directoy Card', path: '/ui/demo/directory-item-card' },
    { label: 'Empty State', path: '/ui/demo/empty-state' },
    { label: 'Input', path: '/ui/demo/input' },
    { label: 'Listbox', path: '/ui/demo/listbox' },
    { label: 'Loading', path: '/ui/demo/loading' },
    { label: 'Menu', path: '/ui/demo/menu' },
    { label: 'Notyf', path: '/ui/demo/notyf' },
    { label: 'Page Header', path: '/ui/demo/page-header' },
    { label: 'Select', path: '/ui/demo/select' },
    { label: 'Table', path: '/ui/demo/table' },
    { label: 'Tree', path: '/ui/demo/tree' },
    { label: 'Tabs', path: '/ui/demo/tabs' },
  ];
}
