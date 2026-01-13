import { Dialog } from '@angular/cdk/dialog';
import { DatePipe } from '@angular/common';
import { ChangeDetectionStrategy, Component, computed, DestroyRef, inject, input } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { Router } from '@angular/router';
import { CashboxesService } from '../../../../../core/services/cashboxes.service';
import { StoresService } from '../../../../../core/services/stores.service';
import { UiBreadcrumb } from '../../../../../core/ui/ui-breadcrumb/ui-breadcrumb';
import { UiButton } from '../../../../../core/ui/ui-button/ui-button';
import { UiDialogConfirm } from '../../../../../core/ui/ui-dialog-confirm/ui-dialog-confirm';
import { UiDialogConfirmData } from '../../../../../core/ui/ui-dialog-confirm/ui-dialog-confirm-data.interface';
import { UiDirectoryItemCard } from '../../../../../core/ui/ui-directory-item-card/ui-directory-item-card';
import { UiEmptyState } from '../../../../../core/ui/ui-empty-state/ui-empty-state';
import { UiLoading } from '../../../../../core/ui/ui-loading/ui-loading';
import { CashboxDialogResult } from '../../../../../shared/interfaces/dialogs/cashbox-dialog.interface';
import { Cashbox } from '../../../../../shared/interfaces/entities/cashbox.interface';
import { CashboxDialog } from './cashbox-dialog/cashbox-dialog';

@Component({
  selector: 'app-cashboxes-page',
  imports: [UiButton, UiDirectoryItemCard, DatePipe, UiBreadcrumb, UiEmptyState, UiLoading],
  templateUrl: './cashboxes-page.html',
  styleUrl: './cashboxes-page.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CashboxesPage {
  private cashboxesService = inject(CashboxesService);
  private storesService = inject(StoresService);
  private dialog = inject(Dialog);
  private router = inject(Router);
  private destroyRef = inject(DestroyRef);

  storeId = input<string>();

  // Fetch store details to show name
  store = this.storesService.getById(() => this.storeId());

  // Filter cashboxes by storeId
  cashboxes = this.cashboxesService.getAll({
    includes: ['store'],
    params: () => {
      const id = this.storeId();
      return id ? { storeId: id } : {};
    },
  });

  breadcrumbItems = computed(() => {
    const base = [
      { label: 'Главная', url: '/core/dashboard' },
      { label: 'Справочники' },
      { label: 'Магазины', url: '/core/directories/stores' },
    ];

    const id = this.storeId();
    if (id) {
      const storeName = this.store.value()?.name ?? '...';
      return [...base, { label: storeName }, { label: 'Кассы' }];
    }

    return [...base, { label: 'Кассы' }];
  });

  onCreate() {
    this.openDialog();
  }

  onEdit(cashbox: Cashbox) {
    this.openDialog(cashbox);
  }

  onDelete(cashbox: Cashbox) {
    const dialogRef = this.dialog.open<boolean, UiDialogConfirmData>(UiDialogConfirm, {
      data: {
        title: 'Удалить кассу',
        message: `Вы уверены, что хотите удалить кассу "${cashbox.name}"?`,
        confirmLabel: 'Удалить',
        variant: 'danger',
      },
    });

    dialogRef.closed.pipe(takeUntilDestroyed(this.destroyRef)).subscribe((result) => {
      if (result) {
        this.cashboxesService
          .delete(cashbox.id)
          .pipe(takeUntilDestroyed(this.destroyRef))
          .subscribe(() => {
            this.reload();
          });
      }
    });
  }

  private openDialog(cashbox?: Cashbox) {
    const dialogRef = this.dialog.open<CashboxDialogResult>(CashboxDialog, {
      data: { cashbox, storeId: this.storeId() },
    });

    dialogRef.closed.pipe(takeUntilDestroyed(this.destroyRef)).subscribe((result) => {
      if (result) this.reload();
    });
  }

  reload() {
    this.cashboxes.reload();
  }

  back() {
    if (this.storeId()) {
      void this.router.navigate(['/core/directories/stores']);
    } else {
      void this.router.navigate(['/core/directories']);
    }
  }
}
