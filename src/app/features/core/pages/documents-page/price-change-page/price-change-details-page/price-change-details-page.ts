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
import {
  ChangeDetectionStrategy,
  Component,
  computed,
  DestroyRef,
  inject,
  input,
} from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { ToNumberPipe } from '../../../../../../core/pipes/to-number-pipe';
import { DocumentPriceChangesService } from '../../../../../../core/services/document-price-changes.service';
import { UiBadge } from '../../../../../../core/ui/ui-badge/ui-badge';
import { UiButton } from '../../../../../../core/ui/ui-button/ui-button';
import { UiCard } from '../../../../../../core/ui/ui-card/ui-card';
import { UiEmptyState } from '../../../../../../core/ui/ui-empty-state/ui-empty-state';
import { UiIcon } from '../../../../../../core/ui/ui-icon/ui-icon.component';
import { UiList } from '../../../../../../core/ui/ui-list/ui-list';
import { UiListItem } from '../../../../../../core/ui/ui-list/ui-list-item/ui-list-item';
import { UiNotyfService } from '../../../../../../core/ui/ui-notyf/ui-notyf.service';
import { UiTable } from '../../../../../../core/ui/ui-table/ui-table';
import { UiTitle } from '../../../../../../core/ui/ui-title/ui-title';
import { DocumentStatus } from '../../../../../../shared/interfaces/constants';
import { DocumentPriceChangeItem } from '../../../../../../shared/interfaces/entities/document-price-change-item.interface';
import { DocumentHistory } from '../../purchases-page/purchase-details-page/document-history/document-history';

@Component({
  selector: 'app-price-change-details-page',
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
    DecimalPipe,
    UiIcon,
    ToNumberPipe,
    CurrencyPipe,
    UiBadge,
    DocumentHistory,
    UiButton,
  ],
  templateUrl: './price-change-details-page.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: { class: 'space-y-4' },
})
export class PriceChangeDetailsPage {
  private priceChangeService = inject(DocumentPriceChangesService);
  private destroyRef = inject(DestroyRef);
  private notyf = inject(UiNotyfService);

  id = input.required<string>();

  priceChange = this.priceChangeService.getById(() => this.id());

  displayedColumns: (keyof DocumentPriceChangeItem | string)[] = [
    'product',
    'priceType',
    'oldValue',
    'newValue',
    'change',
  ];

  productMap = computed(() => {
    const map: Record<string, string> = {};
    const items = this.priceChange.value()?.items || [];
    items.forEach((item) => {
      map[item.productId] = item.product.name;
    });
    return map;
  });

  complete() {
    this.updateStatus(DocumentStatus.COMPLETED);
  }

  revert() {
    this.updateStatus(DocumentStatus.DRAFT);
  }

  private updateStatus(status: DocumentStatus) {
    const id = this.id();
    this.priceChangeService
      .updateStatus(id, status)
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: () => {
          this.notyf.success('Статус документа обновлен');
          this.priceChange.reload();
        },
        error: (err) => {
          this.notyf.error('Ошибка при обновлении статуса');
          console.error(err);
        },
      });
  }
}
