import { ChangeDetectionStrategy, Component, input } from '@angular/core';
import { UiCard } from '../ui-card/ui-card';
import { UiIconWrapper } from '../ui-icon-wrapper/ui-icon-wrapper';
import { IconName } from '../ui-icon/data';
import { UiIcon } from '../ui-icon/ui-icon.component';

export interface StatList {
  label: string;
  value: string | number;

  icon: IconName;
  color: string;
}

@Component({
  selector: 'ui-stat-card',
  imports: [UiCard, UiIconWrapper, UiIcon],
  templateUrl: './ui-stat-card.html',
  styleUrl: './ui-stat-card.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class UiStatCard {
  icon = input.required<IconName>();
  color = input<string>();

  label = input.required<string>();
  value = input.required<string | number>();
}
