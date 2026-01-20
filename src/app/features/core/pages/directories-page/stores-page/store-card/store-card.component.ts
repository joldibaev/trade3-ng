import { Component, input, OnInit, output, signal } from '@angular/core';
import { UiBadge } from '../../../../../../core/ui/ui-badge/ui-badge';
import { UiButton } from '../../../../../../core/ui/ui-button/ui-button';
import { UiCard } from '../../../../../../core/ui/ui-card/ui-card';
import { UiIcon } from '../../../../../../core/ui/ui-icon/ui-icon.component';
import { Cashbox } from '../../../../../../shared/interfaces/entities/cashbox.interface';
import { Store } from '../../../../../../shared/interfaces/entities/store.interface';
import { CashboxListItemComponent } from '../cashbox-list-item/cashbox-list-item.component';

@Component({
  selector: 'app-store-card',
  imports: [UiButton, UiIcon, UiBadge, UiCard, CashboxListItemComponent],
  templateUrl: './store-card.component.html',
})
export class StoreCardComponent implements OnInit {
  store = input.required<Store>();

  isExpanded = input(false);

  expanded = signal(false);

  ngOnInit() {
    this.expanded.set(this.isExpanded());
  }

  edit = output<void>();
  delete = output<void>();
  addCashbox = output<void>();
  editCashbox = output<Cashbox>();
  deleteCashbox = output<Cashbox>();
}
