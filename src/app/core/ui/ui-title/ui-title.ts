import { Location } from '@angular/common';
import { booleanAttribute, ChangeDetectionStrategy, Component, inject, input } from '@angular/core';
import { UiButton } from '../ui-button/ui-button';

@Component({
  selector: 'ui-title',
  imports: [UiButton],
  templateUrl: './ui-title.html',
  styleUrl: './ui-title.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: { class: 'flex items-center gap-2' },
})
export class UiTitle {
  private location = inject(Location);

  title = input.required<string>();
  caption = input<string>();

  withBackBtn = input(false, { transform: booleanAttribute });

  protected backClicked() {
    this.location.back();
  }
}
