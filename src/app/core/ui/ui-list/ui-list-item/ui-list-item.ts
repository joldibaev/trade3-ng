import { ChangeDetectionStrategy, Component, input } from '@angular/core';
import { IconName } from '../../ui-icon/data';
import { UiIcon } from '../../ui-icon/ui-icon.component';

@Component({
  selector: 'ui-list-item',
  imports: [UiIcon],
  templateUrl: './ui-list-item.html',
  styleUrl: './ui-list-item.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: {
    class: 'block',
  },
})
export class UiListItem {
  icon = input<IconName>();
  label = input.required<string>();
}
