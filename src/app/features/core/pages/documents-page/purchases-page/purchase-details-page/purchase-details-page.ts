import {
  CdkCell,
  CdkCellDef,
  CdkColumnDef,
  CdkHeaderCell,
  CdkHeaderCellDef,
  CdkHeaderRow,
  CdkHeaderRowDef,
  CdkNoDataRow,
  CdkRow,
  CdkRowDef,
} from '@angular/cdk/table';
import { CurrencyPipe, DatePipe, DecimalPipe } from '@angular/common';
import { ChangeDetectionStrategy, Component, computed, inject, input } from '@angular/core';
import { FindPipe } from '../../../../../../core/pipes/find-pipe';
import { ToNumberPipe } from '../../../../../../core/pipes/to-number-pipe';
import { DocumentPurchasesService } from '../../../../../../core/services/document-purchases.service';
import { PriceTypesService } from '../../../../../../core/services/price-types.service';
import { UiBadge } from '../../../../../../core/ui/ui-badge/ui-badge';
import { UiButton } from '../../../../../../core/ui/ui-button/ui-button';
import { UiCard } from '../../../../../../core/ui/ui-card/ui-card';
import { UiEmptyState } from '../../../../../../core/ui/ui-empty-state/ui-empty-state';
import { UiIcon } from '../../../../../../core/ui/ui-icon/ui-icon.component';
import { UiList } from '../../../../../../core/ui/ui-list/ui-list';
import { UiListItem } from '../../../../../../core/ui/ui-list/ui-list-item/ui-list-item';
import { UiTable } from '../../../../../../core/ui/ui-table/ui-table';
import { UiTitle } from '../../../../../../core/ui/ui-title/ui-title';
import { DocumentPurchaseItem } from '../../../../../../shared/interfaces/entities/document-purchase-item.interface';
import { DocumentHistory } from './document-history/document-history';

@Component({
  selector: 'app-purchase-details-page',
  standalone: true,
  imports: [
    DatePipe,
    UiCard,
    UiList,
    UiListItem,
    UiTitle,
    CdkCell,
    CdkCellDef,
    CdkColumnDef,
    CdkHeaderCell,
    CdkHeaderRow,
    CdkHeaderRowDef,
    CdkRow,
    CdkRowDef,
    UiEmptyState,
    UiTable,
    CdkHeaderCellDef,
    CdkNoDataRow,
    FindPipe,
    DecimalPipe,
    UiIcon,
    ToNumberPipe,
    CurrencyPipe,
    UiBadge,
    DocumentHistory,
    UiButton,
  ],
  templateUrl: './purchase-details-page.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: { class: 'space-y-4' },
})
export class PurchaseDetailsPage {
  private purchaseService = inject(DocumentPurchasesService);
  private priceTypesService = inject(PriceTypesService);

  id = input.required<string>();

  purchase = this.purchaseService.getById(() => this.id());
  priceTypes = this.priceTypesService.getAll();

  displayedColumns = computed<(keyof DocumentPurchaseItem | string)[]>(() => {
    const list = ['id', 'product', 'quantity', 'price', 'total'];

    if (this.priceTypes.hasValue()) {
      this.priceTypes.value()?.forEach((priceType) => {
        list.push(priceType.id);
      });
    }

    return list;
  });

  productMap = computed(() => {
    const map: Record<string, string> = {};
    this.purchase.value()?.items.forEach((item) => {
      map[item.productId] = item.product.name;
    });
    return map;
  });
}
