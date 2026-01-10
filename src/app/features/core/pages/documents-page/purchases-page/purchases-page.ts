import { Dialog } from '@angular/cdk/dialog';
import { ChangeDetectionStrategy, Component, computed, inject, signal } from '@angular/core';
import { form, FormField } from '@angular/forms/signals';
import { ActivatedRoute, Router } from '@angular/router';
import { filter, switchMap, tap } from 'rxjs';
import { DocumentPurchasesService } from '../../../../../core/services/document-purchases.service';
import { UiButton } from '../../../../../core/ui/ui-button/ui-button';
import { UiCard } from '../../../../../core/ui/ui-card/ui-card';
import { UiDialogConfirm } from '../../../../../core/ui/ui-dialog-confirm/ui-dialog-confirm';
import { UiDialogConfirmData } from '../../../../../core/ui/ui-dialog-confirm/ui-dialog-confirm-data.interface';
import { UiInput } from '../../../../../core/ui/ui-input/ui-input';
import { TableColumn } from '../../../../../core/ui/ui-table/table-column.interface';
import { UiTable } from '../../../../../core/ui/ui-table/ui-table';
import { DocumentPurchase } from '../../../../../shared/interfaces/entities/document-purchase.interface';

@Component({
  selector: 'app-purchases-page',
  imports: [UiButton, UiInput, UiTable, UiCard, FormField],
  templateUrl: './purchases-page.html',
  styleUrl: './purchases-page.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: {
    class: 'flex flex-col gap-4 h-full',
  },
})
export class PurchasesPage {
  private purchasesService = inject(DocumentPurchasesService);
  private dialog = inject(Dialog);
  private router = inject(Router);
  private route = inject(ActivatedRoute);

  // State
  selectedPurchase = signal<DocumentPurchase | undefined>(undefined);

  formState = signal({ query: '' });
  formData = form(this.formState);

  isSearchVisible = signal(false);

  // Resources
  purchases = this.purchasesService.getAll({
    includes: ['vendor', 'store'],
  });

  columns: TableColumn<DocumentPurchase>[] = [
    {
      key: 'id',
      header: '№ Документа',
      width: '120px',
    },
    {
      key: 'date',
      header: 'Дата',
      valueGetter: (row) => (row.date ? new Date(row.date).toLocaleDateString() : '-'),
      width: '100px',
    },
    {
      key: 'vendor',
      header: 'Поставщик',
      valueGetter: (row) => row.vendor?.name || '-',
    },
    {
      key: 'store',
      header: 'Склад',
      valueGetter: (row) => row.store?.name || '-',
    },
    {
      key: 'totalAmount',
      header: 'Сумма',
      valueGetter: (row) => row.totalAmount?.toLocaleString() || '0',
      width: '120px',
    },
    {
      key: 'status',
      header: 'Статус',
      valueGetter: (row) => row.status || '-',
      width: '100px',
    },
  ];

  filteredPurchases = computed(() => {
    const purchases = this.purchases.value() || [];
    const query = this.formData().value().query.toLowerCase();

    if (!query) {
      return purchases;
    }

    return purchases.filter(
      (p) => p.id.toLowerCase().includes(query) || p.vendor?.name.toLowerCase().includes(query),
    );
  });

  selectPurchase(purchase?: DocumentPurchase) {
    this.selectedPurchase.set(purchase);
  }

  // Actions can be added later
  createPurchase() {
    this.router.navigate(['new'], { relativeTo: this.route });
  }

  editCurrentPurchase() {
    const purchase = this.selectedPurchase();
    if (!purchase) return;

    this.router.navigate([purchase.id], { relativeTo: this.route });
  }

  deleteCurrentPurchase() {
    const purchase = this.selectedPurchase();
    if (!purchase) return;

    this.dialog
      .open<boolean, UiDialogConfirmData>(UiDialogConfirm, {
        data: {
          title: 'Удалить документ?',
          message: `Вы действительно хотите удалить приходную накладную №${purchase.id}?`,
          variant: 'danger',
        },
        width: '400px',
      })
      .closed.pipe(
        filter(Boolean),
        switchMap(() => this.purchasesService.delete(purchase.id)),
        tap(() => {
          this.purchases.reload();
          this.selectedPurchase.set(undefined);
        }),
      )
      .subscribe();
  }
}
