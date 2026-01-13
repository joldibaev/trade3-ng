import { Dialog } from '@angular/cdk/dialog';
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
import { Router } from '@angular/router';
import { filter, finalize, switchMap, tap } from 'rxjs';
import { DocumentPurchasesService } from '../../../../../core/services/document-purchases.service';
import { UiButton } from '../../../../../core/ui/ui-button/ui-button';
import { UiDialogConfirm } from '../../../../../core/ui/ui-dialog-confirm/ui-dialog-confirm';
import { UiDialogConfirmData } from '../../../../../core/ui/ui-dialog-confirm/ui-dialog-confirm-data.interface';
import { TableColumn } from '../../../../../core/ui/ui-table/table-column.interface';
import { DocumentStatus } from '../../../../../shared/interfaces/constants';
import { DocumentPurchase } from '../../../../../shared/interfaces/entities/document-purchase.interface';
import { TableStruct } from '../../../components/table-struct/table-struct';
import { PurchaseDialog } from './purchase-dialog/purchase-dialog';

@Component({
  selector: 'app-purchases-page',
  imports: [TableStruct, UiButton],
  templateUrl: './purchases-page.html',
  styleUrl: './purchases-page.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [DatePipe],
})
export class PurchasesPage {
  private service = inject(DocumentPurchasesService);
  private router = inject(Router);
  private dialog = inject(Dialog);
  private destroyRef = inject(DestroyRef);
  private datePipe = inject(DatePipe);

  protected readonly DocumentStatus = DocumentStatus;

  // State
  selectedPurchase = signal<DocumentPurchase | undefined>(undefined);
  searchQuery = signal('');
  isLoading = signal(false);

  // Resources
  purchases = this.service.getAll({ includes: ['vendor', 'store'] });

  columns: TableColumn<DocumentPurchase>[] = [
    {
      key: 'code',
      header: 'Код',
      type: 'text',
      valueGetter: (row) => `${row.code || '-'}`,
      width: '80px',
    },
    {
      key: 'status',
      header: 'Статус',
      type: 'badge',
      valueGetter: (row) => row.status,
      badgeVariants: {
        [DocumentStatus.COMPLETED]: 'success',
        [DocumentStatus.DRAFT]: 'secondary',
        [DocumentStatus.CANCELLED]: 'destructive',
      },
      badgeLabels: {
        [DocumentStatus.COMPLETED]: 'Проведен',
        [DocumentStatus.DRAFT]: 'Черновик',
        [DocumentStatus.CANCELLED]: 'Отменен',
      },
    },
    {
      key: 'date',
      header: 'Дата',
      type: 'date',
      valueGetter: (row) => row.date?.toString(),
    },
    {
      key: 'vendor',
      header: 'Поставщик',
      type: 'text',
      valueGetter: (row) => row.vendor?.name || '-',
    },
    {
      key: 'store',
      header: 'Магазин',
      type: 'text',
      valueGetter: (row) => row.store?.name || '-',
    },
    {
      key: 'totalAmount',
      header: 'Сумма',
      type: 'text',
      valueGetter: (row) => `${row.totalAmount} UZS`,
    },
  ];

  filteredPurchases = computed(() => {
    const list = this.purchases.value() || [];
    const query = this.searchQuery().toLowerCase();

    if (!query) {
      return list;
    }

    return list.filter((item) => {
      const vendorName = item.vendor?.name.toLowerCase() || '';
      const storeName = item.store?.name.toLowerCase() || '';
      return vendorName.includes(query) || storeName.includes(query);
    });
  });

  openDetails() {
    const purchase = this.selectedPurchase();
    if (purchase) {
      void this.router.navigate(['core', 'documents', 'purchases', purchase.id]);
    }
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
          message: `Вы действительно хотите удалить закупку от ${this.datePipe.transform(item.date, 'dd.MM.yyyy')}?`,
          variant: 'danger',
        },
        width: '400px',
      })
      .closed.pipe(
        filter(Boolean),
        switchMap(() => this.service.delete(item.id)),
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

  toggleStatus() {
    const item = this.selectedPurchase();
    if (!item) return;

    const newStatus =
      item.status === DocumentStatus.COMPLETED ? DocumentStatus.DRAFT : DocumentStatus.COMPLETED;

    this.isLoading.set(true);
    this.service
      .updateStatus(item.id, newStatus)
      .pipe(
        finalize(() => this.isLoading.set(false)),
        takeUntilDestroyed(this.destroyRef),
      )
      .subscribe(() => {
        this.purchases.reload();
        this.selectedPurchase.set(undefined);
      });
  }
}
