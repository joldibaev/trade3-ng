import { ChangeDetectionStrategy, Component, input, output } from '@angular/core';
import { UiButton } from '../ui-button/ui-button';
import { IconName } from '../ui-icon/data';
import { UiIcon } from '../ui-icon/ui-icon.component';

@Component({
  selector: 'ui-empty-state',
  imports: [UiIcon, UiButton],
  templateUrl: './ui-empty-state.html',
  styleUrl: './ui-empty-state.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class UiEmptyState {
  title = input.required<string>();
  description = input.required<string>();
  icon = input.required<IconName>();
  actionLabel = input.required<string>();
  actionIcon = input<IconName>('outline-plus');

  action = output<void>();
}
