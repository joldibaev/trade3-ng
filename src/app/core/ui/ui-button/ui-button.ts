import {
  booleanAttribute,
  ChangeDetectionStrategy,
  Component,
  computed,
  input,
  ViewEncapsulation,
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
  encapsulation: ViewEncapsulation.None,
  host: {
    class: 'ui-button',
    '[class.w-full]': 'fluid()',
    '[class.ui-button-icon-only]': 'iconOnly()',
    '[class.ui-button-disabled]': 'loading() || disabled()',
    '[class]': 'classList()',
    '[attr.disabled]': 'disabled() || loading() ? true : null',
    '[attr.type]': 'type()',
    '[attr.aria-busy]': 'loading()',
  },
})
export class UiButton {
  variant = input<'primary' | 'secondary' | 'ghost' | 'danger' | 'link' | 'dashed'>('primary');
  size = input<'sm' | 'md' | 'lg'>('md');
  type = input<'button' | 'submit' | 'reset'>('button');

  icon = input<IconName>();
  iconPosition = input<'left' | 'right'>('left');
  iconOnly = input(false, { transform: booleanAttribute });

  fluid = input(false, { transform: booleanAttribute });
  loading = input(false, { transform: booleanAttribute });
  disabled = input(false, { transform: booleanAttribute });

  classList = computed(() => {
    return [`ui-button-variant-${this.variant()}`, `ui-button-size-${this.size()}`].join(' ');
  });

  iconSize = computed(() => {
    if (this.size() === 'sm') return 16;
    if (this.size() === 'lg') return 20;
    return 18;
  });
}
