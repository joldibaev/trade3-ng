import { Dialog } from '@angular/cdk/dialog';
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
import { DatePipe } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  computed,
  DestroyRef,
  inject,
  signal,
} from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { form, FormField } from '@angular/forms/signals';
import { Router } from '@angular/router';
import { DocumentPriceChangesService } from '../../../../../core/services/document-price-changes.service';
import { UiButton } from '../../../../../core/ui/ui-button/ui-button';
import { UiCard } from '../../../../../core/ui/ui-card/ui-card';
import { UiEmptyState } from '../../../../../core/ui/ui-empty-state/ui-empty-state';
import { IconName } from '../../../../../core/ui/ui-icon/data';
import { UiIcon } from '../../../../../core/ui/ui-icon/ui-icon.component';
import { UiInput } from '../../../../../core/ui/ui-input/ui-input';
import { UiLoading } from '../../../../../core/ui/ui-loading/ui-loading';
import { UiNotyfService } from '../../../../../core/ui/ui-notyf/ui-notyf.service';
import { UiTable } from '../../../../../core/ui/ui-table/ui-table';
import { DocumentStatusComponent } from '../../../../../shared/components/document-status/document-status.component';
import { DocumentStatus } from '../../../../../shared/interfaces/constants';
import { DocumentPriceChange } from '../../../../../shared/interfaces/entities/document-price-change.interface';

@Component({
  selector: 'app-price-change-page',
  imports: [
    UiButton,
    UiCard,
    UiIcon,
    UiLoading,
    UiInput,
    FormField,
    UiTable,
    CdkColumnDef,
    CdkHeaderCellDef,
    CdkHeaderCell,
    CdkCellDef,
    CdkCell,
    CdkHeaderRow,
    CdkHeaderRowDef,
    CdkRowDef,
    CdkRow,
    CdkNoDataRow,
    UiEmptyState,
    DatePipe,
    DocumentStatusComponent,
  ],
  templateUrl: './price-change-page.html',
  styleUrl: './price-change-page.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [DatePipe],
  host: {
    class: 'space-y-4',
  },
})
export class PriceChangePage {
  private documentPriceChangesService = inject(DocumentPriceChangesService);
  private router = inject(Router);
  private dialog = inject(Dialog);
  private destroyRef = inject(DestroyRef);
  private notyf = inject(UiNotyfService);

  displayedColumns: (keyof DocumentPriceChange | string)[] = [
    'id',
    'code',
    'date',
    'itemsCount',
    'status',
    'action',
  ];

  protected readonly DocumentStatus = DocumentStatus;

  // State
  searchForm = form(signal({ query: '' }));

  // Resources
  priceChanges = this.documentPriceChangesService.getAll();
  summary = this.documentPriceChangesService.getSummary();

  stats = computed(() => {
    const data = this.summary.value();

    return [
      {
        label: 'Всего изменений',
        value: data?.totalCount || 0,
        icon: 'outline-file-text' as IconName,
        color: 'bg-indigo-50 text-indigo-600',
      },
      {
        label: 'Проведено',
        value: data?.completedCount || 0,
        icon: 'outline-check' as IconName,
        color: 'bg-primary-50 text-emerald-600',
      },
      {
        label: 'Товаров изменено',
        value: data?.totalCount || 0,
        icon: 'outline-tag' as IconName,
        color: 'bg-amber-50 text-amber-600',
      },
    ];
  });

  filteredPriceChanges = computed(() => {
    const list = this.priceChanges.value() || [];
    const query = this.searchForm().value().query.toLowerCase();

    if (!query) {
      return list;
    }

    return list.filter((item) => {
      const code = item.code?.toString() || '';
      return code.includes(query);
    });
  });

  openDetails(item: DocumentPriceChange) {
    void this.router.navigate(['core', 'documents', 'price-change', item.id]);
  }

  openCreateDialog() {
    // TODO: Implement create dialog
    this.notyf.info('Функция в разработке');
  }

  updateStatus(id: string, status: DocumentStatus) {
    this.documentPriceChangesService
      .updateStatus(id, status)
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: () => {
          this.notyf.success('Статус документа обновлен');
          this.priceChanges.reload();
        },
        error: (err) => {
          this.notyf.error('Ошибка при обновлении статуса');
          console.error(err);
        },
      });
  }
}
