import { DecimalPipe, SlicePipe } from '@angular/common';
import { ChangeDetectionStrategy, Component, computed, input, output, signal } from '@angular/core';
import { UiButton } from '../../../../../../../../core/ui/ui-button/ui-button';
import { UiCard } from '../../../../../../../../core/ui/ui-card/ui-card';
import { UiIcon } from '../../../../../../../../core/ui/ui-icon/ui-icon.component';
import { DocumentStatus } from '../../../../../../../../shared/interfaces/constants';
import { PriceType } from '../../../../../../../../shared/interfaces/entities/price-type.interface';

@Component({
  selector: 'app-purchase-item-card',
  standalone: true,
  imports: [UiIcon, SlicePipe, UiCard, DecimalPipe, UiButton],
  templateUrl: './purchase-item-card.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PurchaseItemCardComponent {
  item = input.required<any>(); // Using any transiently, strictly explicit interface below is better but efficient here
  priceTypes = input.required<PriceType[]>();
  status = input<DocumentStatus>(DocumentStatus.DRAFT);
  readonly = input(false);

  edit = output<void>();
  remove = output<void>();
  restore = output<void>();

  isExpanded = signal(false);

  // Map price type id to name for easy lookup
  priceTypeMap = computed(() => {
    return this.priceTypes().reduce(
      (acc, pt) => {
        acc[pt.id] = pt.name;
        return acc;
      },
      {} as Record<string, string>,
    );
  });

  total = computed(() => {
    return (this.item().quantity || 0) * (this.item().price || 0);
  });

  toggleExpand() {
    this.isExpanded.update((v) => !v);
  }
}
