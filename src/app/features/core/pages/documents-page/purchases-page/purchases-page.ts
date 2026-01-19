import { Dialog } from '@angular/cdk/dialog';
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
import { filter, switchMap, tap } from 'rxjs';
import { DocumentPurchasesService } from '../../../../../core/services/document-purchases.service';
import { UiButton } from '../../../../../core/ui/ui-button/ui-button';
import { UiCard } from '../../../../../core/ui/ui-card/ui-card';
import { UiDialogConfirm } from '../../../../../core/ui/ui-dialog-confirm/ui-dialog-confirm';
import { UiDialogConfirmData } from '../../../../../core/ui/ui-dialog-confirm/ui-dialog-confirm-data.interface';
import { IconName } from '../../../../../core/ui/ui-icon/data';
import { UiIcon } from '../../../../../core/ui/ui-icon/ui-icon.component';
import { UiInput } from '../../../../../core/ui/ui-input/ui-input';
import { UiLoading } from '../../../../../core/ui/ui-loading/ui-loading';
import { TableColumn } from '../../../../../core/ui/ui-table/table-column.interface';
import { UiTable } from '../../../../../core/ui/ui-table/ui-table';
import { DocumentStatus } from '../../../../../shared/interfaces/constants';
import { DocumentPurchase } from '../../../../../shared/interfaces/entities/document-purchase.interface';
import { PurchaseDialog } from './purchase-dialog/purchase-dialog';

@Component({
  selector: 'app-purchases-page',
  imports: [UiButton, UiCard, UiIcon, UiLoading, UiTable, UiInput, FormField, DecimalPipe],
  templateUrl: './purchases-page.html',
  styleUrl: './purchases-page.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [DatePipe],
  host: {
    class: 'flex flex-col gap-4 h-full',
  },
})
export class PurchasesPage {
  private documentPurchasesService = inject(DocumentPurchasesService);
  private router = inject(Router);
  private dialog = inject(Dialog);
  private destroyRef = inject(DestroyRef);
  private datePipe = inject(DatePipe);

  protected readonly DocumentStatus = DocumentStatus;

  // State
  selectedPurchase = signal<DocumentPurchase | undefined>(undefined);
  searchForm = form(signal({ query: '' }));

  // Resources
  purchases = this.documentPurchasesService.getAll();

  stats = computed(() => {
    const list = this.purchases.value() || [];
    const totalSum = list.reduce((sum, item) => sum + (item.total || 0), 0);

    return [
      {
        label: 'Всего закупок',
        value: list.length,
        icon: 'outline-file-text' as IconName,
        color: 'bg-indigo-50 text-indigo-600',
      },
      {
        label: 'Проведено',
        value: list.filter((i) => i.status === DocumentStatus.COMPLETED).length,
        icon: 'outline-check' as IconName,
        color: 'bg-emerald-50 text-emerald-600',
      },
      {
        label: 'Сумма закупок',
        value: totalSum,
        icon: 'outline-cash' as IconName,
        color: 'bg-emerald-50 text-emerald-600',
        isCurrency: true,
      },
    ];
  });

  columns: TableColumn<DocumentPurchase>[] = [
    {
      key: 'code',
      header: 'Код',
      type: 'text',
      valueGetter: (row) => `#${row.code || '-'}`,
      classList: 'font-mono text-slate-500',
      width: '80px',
    },
    {
      key: 'status',
      header: 'Статус',
      type: 'document-badge',
      valueGetter: (row) => row.status,
      width: '120px',
    },
    {
      key: 'date',
      header: 'Дата',
      type: 'text',
      icon: 'outline-calendar',
      valueGetter: (row) => (row.date ? this.datePipe.transform(row.date, 'dd.MM.yyyy') : '-'),
      width: '140px',
    },
    {
      key: 'vendor',
      header: 'Поставщик',
      type: 'text',
      icon: 'outline-truck',
      valueGetter: (row) => row.vendor?.name || '-',
    },
    {
      key: 'store',
      header: 'Магазин',
      type: 'text',
      icon: 'outline-building-store',
      valueGetter: (row) => row.store?.name || '-',
    },
    {
      key: 'total',
      header: 'Сумма',
      type: 'text',
      valueGetter: (row) => {
        return `${(row.total || 0).toLocaleString('en-US', { minimumFractionDigits: 0, maximumFractionDigits: 0 })} UZS`;
      },
      classList: 'font-bold text-slate-900',
      width: '160px',
    },
    {
      key: 'actions',
      header: 'Действия',
      type: 'template',
      templateName: 'actions',
      width: '120px',
      align: 'right',
    },
  ];

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
      .closed.pipe(
        filter(Boolean),
        tap(() => this.purchases.reload()),
        takeUntilDestroyed(this.destroyRef),
      )
      .subscribe();
  }

  deletePurchase(item: DocumentPurchase) {
    this.dialog
      .open<boolean, UiDialogConfirmData>(UiDialogConfirm, {
        data: {
          title: 'Удалить закупку?',
          message: `Вы действительно хотите удалить закупку #${item.code} от ${this.datePipe.transform(item.date, 'dd.MM.yyyy')}?`,
          variant: 'danger',
          confirmLabel: 'Удалить',
        },
        width: '400px',
      })
      .closed.pipe(
        filter(Boolean),
        switchMap(() => this.documentPurchasesService.delete(item.id)),
        tap(() => {
          this.purchases.reload();
          if (this.selectedPurchase()?.id === item.id) {
            this.selectedPurchase.set(undefined);
          }
        }),
        takeUntilDestroyed(this.destroyRef),
      )
      .subscribe();
  }
}
