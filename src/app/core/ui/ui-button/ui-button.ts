import {
  booleanAttribute,
  ChangeDetectionStrategy,
  Component,
  computed,
  input,
} from '@angular/core';
import { IconName } from '../ui-icon/data';
import { UiIcon } from '../ui-icon/ui-icon.component';
import { UiLoading } from '../ui-loading/ui-loading';

@Component({
  // eslint-disable-next-line @angular-eslint/component-selector
  selector: 'button[uiButton], a[uiButton]',
  imports: [UiLoading, UiIcon],
  templateUrl: './ui-button.html',
  styleUrl: './ui-button.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: {
    class: 'ui-button',
    '[class.ui-button-disabled]': 'loading() || disabled()',
    '[class]': 'classList()',
  },
})
export class UiButton {
  variant = input<'primary' | 'secondary' | 'ghost' | 'danger'>('primary');
  size = input<'md' | 'sm'>('md');
  loading = input(false, { transform: booleanAttribute });
  disabled = input(false, { transform: booleanAttribute });
  icon = input<IconName>();
  onlyIcon = input(false, { transform: booleanAttribute });

  classList = computed(() => {
    const classList: string[] = [];

    classList.push(`ui-button-variant-${this.variant()}`);
    classList.push(`ui-button-size-${this.size()}`);

    if (this.onlyIcon()) {
      classList.push('ui-button-icon-only');
    }

    return classList;
  });
}
