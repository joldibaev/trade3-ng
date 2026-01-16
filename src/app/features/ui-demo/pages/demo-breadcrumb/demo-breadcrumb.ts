import { ChangeDetectionStrategy, Component } from '@angular/core';
import { UiBreadcrumb } from '../../../../core/ui/ui-breadcrumb/ui-breadcrumb';
import { UiCard } from '../../../../core/ui/ui-card/ui-card';
import { UiPageHeader } from '../../../../core/ui/ui-page-header/ui-page-header';

@Component({
  selector: 'app-demo-breadcrumb',
  standalone: true,
  imports: [UiPageHeader, UiCard, UiBreadcrumb],
  templateUrl: './demo-breadcrumb.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: { class: 'flex flex-col gap-4' },
})
export class DemoBreadcrumbPage {
  items = [
    { label: 'Home', url: '/' },
    { label: 'Section', url: '/section' },
    { label: 'Current Page' },
  ];

  deepItems = [
    { label: 'Root', url: '/' },
    { label: 'Level 1', url: '/l1' },
    { label: 'Level 2', url: '/l2' },
    { label: 'Level 3', url: '/l3' },
    { label: 'Current' },
  ];
}
