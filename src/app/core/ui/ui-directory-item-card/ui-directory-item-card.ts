import { ChangeDetectionStrategy, Component, input, output } from '@angular/core';
import { UiButton } from '../ui-button/ui-button';
import { UiCard } from '../ui-card/ui-card';
import { IconName } from '../ui-icon/data';
import { UiIcon } from '../ui-icon/ui-icon.component';

@Component({
  selector: 'ui-directory-item-card',
  imports: [UiIcon, UiButton, UiCard],
  templateUrl: './ui-directory-item-card.html',
  styleUrl: './ui-directory-item-card.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class UiDirectoryItemCard {
  title = input.required<string>();
  subtitle = input<string>();
  icon = input<IconName>();

  edit = output<void>();
  delete = output<void>();
}
