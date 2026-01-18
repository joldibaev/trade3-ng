import { ChangeDetectionStrategy, Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { UiButton } from '../../../../core/ui/ui-button/ui-button';
import { UiCard } from '../../../../core/ui/ui-card/ui-card';
import { UiPageHeader } from '../../../../core/ui/ui-page-header/ui-page-header';

@Component({
  selector: 'app-ui-demo-index',
  standalone: true,
  imports: [UiPageHeader, UiCard, RouterLink, UiButton],
  templateUrl: './ui-demo-index.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: { class: 'flex flex-col gap-4' },
})
export class UiDemoIndexPage {
  items = [
    { label: 'Accordion', route: 'accordion' },
    { label: 'Autocomplete', route: 'autocomplete' },
    { label: 'Badge', route: 'badge' },
    { label: 'Breadcrumb', route: 'breadcrumb' },
    { label: 'Button', route: 'button' },
    { label: 'Card', route: 'card' },
    { label: 'Checkbox', route: 'checkbox' },
    { label: 'Dialog', route: 'dialog' },
    { label: 'Empty State', route: 'empty-state' },
    { label: 'Input', route: 'input' },
    { label: 'Listbox', route: 'listbox' },
    { label: 'Loading', route: 'loading' },
    { label: 'Menu', route: 'menu' },
    { label: 'Notyf', route: 'notyf' },
    { label: 'Page Header', route: 'page-header' },
    { label: 'Select', route: 'select' },
    { label: 'Switch', route: 'switch' },
    { label: 'Table', route: 'table' },
    { label: 'Tabs', route: 'tabs' },
    { label: 'Tree', route: 'tree' },
  ].sort((a, b) => a.label.localeCompare(b.label));
}
