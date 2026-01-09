import { ChangeDetectionStrategy, Component, input, numberAttribute } from '@angular/core';

import { UiIcon } from '../ui-icon/ui-icon.component';

@Component({
  selector: 'ui-loading',
  imports: [UiIcon],
  templateUrl: './ui-loading.html',
  styleUrl: './ui-loading.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class UiLoading {
  width = input.required<number, unknown>({ transform: numberAttribute });
  height = input.required<number, unknown>({ transform: numberAttribute });
}
