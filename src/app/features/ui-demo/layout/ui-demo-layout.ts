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
  menuGroups = [
    {
      label: 'Forms & Inputs',
      items: [
        { label: 'Input', path: '/ui/demo/input' },
        { label: 'Select', path: '/ui/demo/select' },
        { label: 'Listbox', path: '/ui/demo/listbox' },
        { label: 'Autocomplete', path: '/ui/demo/autocomplete' },
        { label: 'Checkbox', path: '/ui/demo/checkbox' },
        { label: 'Switch', path: '/ui/demo/switch' },
      ],
    },
    {
      label: 'Actions & Overlays',
      items: [
        { label: 'Button', path: '/ui/demo/button' },
        { label: 'Dialog', path: '/ui/demo/dialog' },
        { label: 'Menu', path: '/ui/demo/menu' },
        { label: 'Icon', path: '/ui/demo/icon' },
      ],
    },
    {
      label: 'Data Display',
      items: [
        { label: 'Table', path: '/ui/demo/table' },
        { label: 'Card', path: '/ui/demo/card' },
        { label: 'Badge', path: '/ui/demo/badge' },
        { label: 'Accordion', path: '/ui/demo/accordion' },
        { label: 'Tree', path: '/ui/demo/tree' },
        { label: 'Empty State', path: '/ui/demo/empty-state' },
      ],
    },
    {
      label: 'Feedback & Navigation',
      items: [
        { label: 'Notyf', path: '/ui/demo/notyf' },
        { label: 'Loading', path: '/ui/demo/loading' },
        { label: 'Breadcrumb', path: '/ui/demo/breadcrumb' },
        { label: 'Page Header', path: '/ui/demo/page-header' },
        { label: 'Tabs', path: '/ui/demo/tabs' },
      ],
    },
  ];
}
