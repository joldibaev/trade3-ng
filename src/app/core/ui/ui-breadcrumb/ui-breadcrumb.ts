import { ChangeDetectionStrategy, Component, input } from '@angular/core';
import { RouterLink } from '@angular/router';
import { UiIcon } from '../ui-icon/ui-icon.component';

export interface BreadcrumbItem {
  label: string;
  url?: string;
}

@Component({
  selector: 'ui-breadcrumb',
  imports: [RouterLink, UiIcon],
  templateUrl: './ui-breadcrumb.html',
  styleUrl: './ui-breadcrumb.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class UiBreadcrumb {
  items = input.required<BreadcrumbItem[]>();
}
