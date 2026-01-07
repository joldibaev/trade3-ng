import { Dialog } from '@angular/cdk/dialog';
import { DatePipe } from '@angular/common';
import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { CashboxesService } from '../../../../../core/services/cashboxes.service';
import { StoresService } from '../../../../../core/services/stores.service';
import { UiButton } from '../../../../../core/ui/ui-button/ui-button';
import { UiDialogConfirm } from '../../../../../core/ui/ui-dialog-confirm/ui-dialog-confirm';
import { UiDirectoryItemCard } from '../../../../../core/ui/ui-directory-item-card/ui-directory-item-card';
import { UiIcon } from '../../../../../core/ui/ui-icon/ui-icon.component';
import { Cashbox } from '../../../../../shared/interfaces/entities/cashbox.interface';
import { CashboxDialog, CashboxDialogResult } from './cashbox-dialog/cashbox-dialog';

@Component({
  selector: 'app-cashboxes-page',
  imports: [UiButton, UiIcon, UiDirectoryItemCard, DatePipe],
  templateUrl: './cashboxes-page.html',
  styleUrl: './cashboxes-page.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CashboxesPage {
  private cashboxesService = inject(CashboxesService);
  private storesService = inject(StoresService);
  private dialog = inject(Dialog);
  private route = inject(ActivatedRoute);

  storeId = this.route.snapshot.paramMap.get('storeId');

  // Fetch store details to show name
  store = this.storeId ? this.storesService.getById(this.storeId) : undefined;

  // Filter cashboxes by storeId
  cashboxes = this.cashboxesService.getAll({
    includes: ['store'],
    params: this.storeId ? { storeId: this.storeId } : {},
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
}
