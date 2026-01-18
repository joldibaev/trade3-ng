import { Location } from '@angular/common';
import { booleanAttribute, ChangeDetectionStrategy, Component, inject, input } from '@angular/core';
import { UiButton } from '../ui-button/ui-button';
import { UiIcon } from '../ui-icon/ui-icon.component';

@Component({
  selector: 'ui-page-header',
  standalone: true,
  imports: [UiButton, UiIcon],
  templateUrl: './ui-page-header.html',
  styleUrl: './ui-page-header.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: { class: 'block mb-2' },
})
export class UiPageHeader {
  private location = inject(Location);

  title = input.required<string>();

  showBack = input(false, { transform: booleanAttribute });

  back() {
    this.location.back();
  }
}
