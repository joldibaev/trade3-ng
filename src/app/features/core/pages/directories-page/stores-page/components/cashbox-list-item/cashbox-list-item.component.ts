import { Component, input, output } from '@angular/core';
import { UiButton } from '../../../../../../../core/ui/ui-button/ui-button';
import { UiIcon } from '../../../../../../../core/ui/ui-icon/ui-icon.component';
import { Cashbox } from '../../../../../../../shared/interfaces/entities/cashbox.interface';

@Component({
  selector: 'app-cashbox-list-item',
  imports: [UiButton, UiIcon],
  templateUrl: './cashbox-list-item.component.html',
})
export class CashboxListItemComponent {
  cashbox = input.required<Cashbox>();

  edit = output<void>();
  delete = output<void>();
}
