import {
  booleanAttribute,
  ChangeDetectionStrategy,
  Component,
  computed,
  input,
  ViewEncapsulation,
} from '@angular/core';
import { UiLoading } from '../ui-loading/ui-loading';

@Component({
  // eslint-disable-next-line @angular-eslint/component-selector
  selector: 'button[uiButton], a[uiButton]',
  imports: [UiLoading],
  templateUrl: './ui-button.html',
  styleUrl: './ui-button.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
  host: {
    class: 'ui-button',
    '[class.ui-button-disabled]': 'loading() || disabled()',
    '[class]': 'classList()',
  },
})
export class UiButton {
  variant = input<'primary' | 'secondary' | 'ghost' | 'danger'>('primary');
  size = input<'icon' | 'sm' | 'md' | 'lg'>('md');

  loading = input(false, { transform: booleanAttribute });
  disabled = input(false, { transform: booleanAttribute });

  classList = computed(() => {
    const classList: string[] = [];

    classList.push(`ui-button-variant-${this.variant()}`);
    classList.push(`ui-button-size-${this.size()}`);

    return classList;
  });
}
