import { DatePipe, JsonPipe } from '@angular/common';
import { ChangeDetectionStrategy, Component, inject, input } from '@angular/core';
import { DocumentPurchasesService } from '../../../../../../core/services/document-purchases.service';
import { UiCard } from '../../../../../../core/ui/ui-card/ui-card';
import { UiList } from '../../../../../../core/ui/ui-list/ui-list';
import { UiListItem } from '../../../../../../core/ui/ui-list/ui-list-item/ui-list-item';
import { UiTitle } from '../../../../../../core/ui/ui-title/ui-title';

@Component({
  selector: 'app-purchase-details-page',
  standalone: true,
  imports: [DatePipe, UiCard, UiList, UiListItem, UiTitle, JsonPipe],
  templateUrl: './purchase-details-page.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: { class: 'flex flex-col gap-4' },
})
export class PurchaseDetailsPage {
  private purchaseService = inject(DocumentPurchasesService);

  id = input.required<string>();

  purchase = this.purchaseService.getById(() => this.id());
}
