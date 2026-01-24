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
import { DatePipe, DecimalPipe } from '@angular/common';
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
import { DocumentPurchasesService } from '../../../../../core/services/document-purchases.service';
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
import { DocumentPurchase } from '../../../../../shared/interfaces/entities/document-purchase.interface';
import { PurchaseDialog } from './purchase-dialog/purchase-dialog';

@Component({
  selector: 'app-purchases-page',
  imports: [
    UiButton,
    UiCard,
    UiIcon,
    UiLoading,
    UiInput,
    FormField,
    DecimalPipe,
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
  templateUrl: './purchases-page.html',
  styleUrl: './purchases-page.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [DatePipe],
  host: {
    class: 'space-y-4',
  },
})
export class PurchasesPage {
  private documentPurchasesService = inject(DocumentPurchasesService);
  private router = inject(Router);
  private dialog = inject(Dialog);
  private destroyRef = inject(DestroyRef);
  private notyf = inject(UiNotyfService);

  displayedColumns: (keyof DocumentPurchase | string)[] = [
    'id',
    'code',
    'date',
    'vendor',
    'store',
    'total',
    'status',
    'action',
  ];

  protected readonly DocumentStatus = DocumentStatus;

  // State
  searchForm = form(signal({ query: '' }));

  // Resources
  purchases = this.documentPurchasesService.getAll();
  summary = this.documentPurchasesService.getSummary();

  stats = computed(() => {
    const data = this.summary.value();

    return [
      {
        label: 'Всего закупок',
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
        label: 'Сумма закупок',
        value: data?.totalAmount || 0,
        icon: 'outline-cash' as IconName,
        color: 'bg-primary-50 text-emerald-600',
        isCurrency: true,
      },
    ];
  });

  filteredPurchases = computed(() => {
    const list = this.purchases.value() || [];
    const query = this.searchForm().value().query.toLowerCase();

    if (!query) {
      return list;
    }

    return list.filter((item) => {
      const vendorName = item.vendor?.name.toLowerCase() || '';
      const storeName = item.store?.name.toLowerCase() || '';
      const code = item.code?.toString() || '';
      return vendorName.includes(query) || storeName.includes(query) || code.includes(query);
    });
  });

  openDetails(item: DocumentPurchase) {
    void this.router.navigate(['core', 'documents', 'purchases', item.id]);
  }

  openCreateDialog() {
    this.dialog
      .open<DocumentPurchase>(PurchaseDialog, { width: '400px' })
      .closed.subscribe((res) => {
        if (res) {
          void this.router.navigate(['core', 'documents', 'purchases', res.id]);
        }
      });
  }

  updateStatus(id: string, status: DocumentStatus) {
    this.documentPurchasesService
      .updateStatus(id, status)
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: () => {
          this.notyf.success('Статус документа обновлен');
          this.purchases.reload();
        },
        error: (err) => {
          this.notyf.error('Ошибка при обновлении статуса');
          console.error(err);
        },
      });
  }
}
