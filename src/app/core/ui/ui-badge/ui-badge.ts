import { ChangeDetectionStrategy, Component, computed, input } from '@angular/core';

export type UiBadgeVariant = 'primary' | 'secondary' | 'destructive' | 'outline' | 'success';

@Component({
  selector: 'ui-badge',
  templateUrl: './ui-badge.html',
  styleUrl: './ui-badge.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: {
    class: 'ui-badge',
    '[class]': 'classList()',
  },
})
export class UiBadge {
  variant = input<UiBadgeVariant>('primary');

  classList = computed(() => {
    return `ui-badge-variant-${this.variant()}`;
  });
}
