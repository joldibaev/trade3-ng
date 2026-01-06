import { booleanAttribute, ChangeDetectionStrategy, Component, input } from '@angular/core';
import { UiLoading } from '../ui-loading/ui-loading';

@Component({
  // eslint-disable-next-line @angular-eslint/component-selector
  selector: 'button[uiButton], a[uiButton]',
  imports: [UiLoading],
  templateUrl: './ui-button.html',
  styleUrl: './ui-button.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: {
    class: 'ui-button',
  },
})
export class UiButton {
  variant = input<'primary' | 'secondary' | 'ghost'>('primary');
  loading = input(false, { transform: booleanAttribute });
}
