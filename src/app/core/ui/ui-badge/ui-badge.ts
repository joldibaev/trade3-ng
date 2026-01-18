import {
  ChangeDetectionStrategy,
  Component,
  computed,
  input,
  ViewEncapsulation,
} from '@angular/core';

export type UiBadgeVariant =
  | 'primary'
  | 'success'
  | 'warning'
  | 'destructive'
  | 'processing'
  | 'neutral';

export type UiBadgeMode = 'subtle' | 'solid';
export type UiBadgeSize = 'xs' | 'sm' | 'md';

@Component({
  selector: 'ui-badge',
  imports: [],
  templateUrl: './ui-badge.html',
  styleUrl: './ui-badge.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
  host: {
    class: 'ui-badge',
    '[class]': 'classList()',
  },
})
export class UiBadge {
  variant = input<UiBadgeVariant>('primary');
  mode = input<UiBadgeMode>('subtle');
  size = input<UiBadgeSize>('md');

  classList = computed(() => {
    return [
      `ui-badge-variant-${this.variant()}`,
      `ui-badge-mode-${this.mode()}`,
      `ui-badge-size-${this.size()}`,
    ].join(' ');
  });
}
