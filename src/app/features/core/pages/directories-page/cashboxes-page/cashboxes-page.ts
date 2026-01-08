import { Dialog } from '@angular/cdk/dialog';
import { DatePipe } from '@angular/common';
import { ChangeDetectionStrategy, Component, computed, inject } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { CashboxesService } from '../../../../../core/services/cashboxes.service';
import { StoresService } from '../../../../../core/services/stores.service';
import { UiBreadcrumb } from '../../../../../core/ui/ui-breadcrumb/ui-breadcrumb';
import { UiButton } from '../../../../../core/ui/ui-button/ui-button';
import { UiDialogConfirm } from '../../../../../core/ui/ui-dialog-confirm/ui-dialog-confirm';
import { UiDirectoryItemCard } from '../../../../../core/ui/ui-directory-item-card/ui-directory-item-card';
import { UiEmptyState } from '../../../../../core/ui/ui-empty-state/ui-empty-state';
import { UiLoading } from '../../../../../core/ui/ui-loading/ui-loading';
import { Cashbox } from '../../../../../shared/interfaces/entities/cashbox.interface';
import { CashboxDialog } from './cashbox-dialog/cashbox-dialog';
import { CashboxDialogResult } from './cashbox-dialog/cashbox-dialog-result.interface';

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
  private route = inject(ActivatedRoute);
  private router = inject(Router);

  storeId = this.route.snapshot.paramMap.get('storeId');

  // Fetch store details to show name
  store = this.storeId ? this.storesService.getById(this.storeId) : undefined;

  // Filter cashboxes by storeId
  cashboxes = this.cashboxesService.getAll({
    includes: ['store'],
    params: this.storeId ? { storeId: this.storeId } : {},
  });

  breadcrumbItems = computed(() => {
    const base = [
      { label: 'Главная', url: '/core/dashboard' },
      { label: 'Справочники' },
      { label: 'Магазины', url: '/core/directories/stores' },
    ];

    if (this.storeId) {
      const storeName = this.store?.value()?.name ?? '...';
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
    const dialogRef = this.dialog.open<boolean>(UiDialogConfirm, {
      data: {
        title: 'Удалить кассу',
        message: `Вы уверены, что хотите удалить кассу "${cashbox.name}"?`,
        confirmLabel: 'Удалить',
        variant: 'danger',
      },
      backdropClass: 'bg-black/30',
    });

    dialogRef.closed.subscribe((result) => {
      if (result) {
        this.cashboxesService.delete(cashbox.id).subscribe(() => {
          this.reload();
        });
      }
    });
  }

  private openDialog(cashbox?: Cashbox) {
    const dialogRef = this.dialog.open<CashboxDialogResult>(CashboxDialog, {
      data: { cashbox, storeId: this.storeId },
      disableClose: true,
      backdropClass: 'bg-black/30',
    });

    dialogRef.closed.subscribe((result) => {
      if (!result) return;

      const { name, storeId } = result;
      if (cashbox) {
        this.cashboxesService.update(cashbox.id, { name, storeId }).subscribe(() => {
          this.reload();
        });
      } else {
        const newCashbox = {
          name,
          storeId,
        } as unknown as Cashbox;
        this.cashboxesService.create(newCashbox).subscribe(() => {
          this.reload();
        });
      }
    });
  }

  reload() {
    this.cashboxes.reload();
  }

  back() {
    if (this.storeId) {
      this.router.navigate(['/core/directories/stores']);
    } else {
      this.router.navigate(['/core/directories']);
    }
  }
}
