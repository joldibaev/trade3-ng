import { ChangeDetectionStrategy, Component, input, signal } from '@angular/core';

@Component({
  // eslint-disable-next-line @angular-eslint/component-selector
  selector: 'button[uiButton], a[uiButton]',
  imports: [],
  templateUrl: './ui-button.html',
  styleUrl: './ui-button.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class UiButton {
  variant = input<'primary' | 'secondary' | 'ghost'>('primary');

  loading = signal(true);
}
