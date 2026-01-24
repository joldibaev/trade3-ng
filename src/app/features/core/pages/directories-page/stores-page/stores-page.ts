import { Dialog } from '@angular/cdk/dialog';
import { NgClass } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  computed,
  DestroyRef,
  inject,
  signal,
} from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { CashboxesService } from '../../../../../core/services/cashboxes.service';
import { StoresService } from '../../../../../core/services/stores.service';
import { UiButton } from '../../../../../core/ui/ui-button/ui-button';
import { UiCard } from '../../../../../core/ui/ui-card/ui-card';
import { UiDialogConfirm } from '../../../../../core/ui/ui-dialog-confirm/ui-dialog-confirm';
import { UiDialogConfirmData } from '../../../../../core/ui/ui-dialog-confirm/ui-dialog-confirm-data.interface';
import { UiEmptyState } from '../../../../../core/ui/ui-empty-state/ui-empty-state';
import { IconName } from '../../../../../core/ui/ui-icon/data';
import { UiIcon } from '../../../../../core/ui/ui-icon/ui-icon.component';
import { UiLoading } from '../../../../../core/ui/ui-loading/ui-loading';
import { CashboxDialogData } from '../../../../../shared/interfaces/dialogs/cashbox-dialog.interface';
import { StoreDialogResult } from '../../../../../shared/interfaces/dialogs/store-dialog.interface';
import { Cashbox } from '../../../../../shared/interfaces/entities/cashbox.interface';
import { Store } from '../../../../../shared/interfaces/entities/store.interface';
import { CashboxDialog } from './cashbox-dialog/cashbox-dialog';
import { StoreCardComponent } from './store-card/store-card.component';
import { StoreDialog } from './store-dialog/store-dialog';

interface StoreStat {
  label: string;
  value: string | number;
  icon: IconName;
  color: string;
}

@Component({
  selector: 'app-stores-page',
  imports: [UiButton, UiCard, UiEmptyState, UiLoading, UiIcon, NgClass, StoreCardComponent],
  templateUrl: './stores-page.html',
  styleUrl: './stores-page.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: {
    class: 'space-y-4',
  },
})
export class StoresPage {
  private storesService = inject(StoresService);
  private cashboxesService = inject(CashboxesService);
  private dialog = inject(Dialog);
  private destroyRef = inject(DestroyRef);

  stores = this.storesService.getAll({ includes: ['cashboxes'] });
  expandedStores = signal<Record<string, boolean>>({ '1': true });

  stats = computed<StoreStat[]>(() => {
    const list = this.stores.value() || [];
    const activeCashboxes = list.reduce((sum, store) => sum + (store.cashboxes?.length || 0), 0);
    const activeStores = list.filter((s) => s.isActive).length;

    return [
      {
        label: 'Всего магазинов',
        value: list.length,
        icon: 'outline-building-store',
        color: 'bg-primary-50 text-emerald-600',
      },
      {
        label: 'Активных касс',
        value: activeCashboxes,
        icon: 'outline-device-desktop',
        color: 'bg-blue-50 text-blue-600',
      },
      {
        label: 'Продажи за сегодня',
        value: '6,130,000 UZS',
        icon: 'outline-receipt',
        color: 'bg-amber-50 text-amber-600',
      },
      {
        label: 'Активных магазинов',
        value: activeStores,
        icon: 'outline-circle-check',
        color: 'bg-primary-50 text-emerald-600',
      },
    ];
  });

  toggleStore(storeId: string) {
    this.expandedStores.update((prev) => ({
      ...prev,
      [storeId]: !prev[storeId],
    }));
  }

  onCreate() {
    this.openDialog();
  }

  onEdit(store: Store) {
    this.openDialog(store);
  }

  onDelete(store: Store) {
    const dialogRef = this.dialog.open<boolean, UiDialogConfirmData>(UiDialogConfirm, {
      data: {
        title: 'Удалить магазин',
        message: `Вы уверены, что хотите удалить магазин "${store.name}"?`,
        confirmLabel: 'Удалить',
        variant: 'danger',
      },
    });

    dialogRef.closed.pipe(takeUntilDestroyed(this.destroyRef)).subscribe((result) => {
      if (result) {
        this.storesService
          .delete(store.id)
          .pipe(takeUntilDestroyed(this.destroyRef))
          .subscribe(() => {
            this.reload();
          });
      }
    });
  }

  onAddCashbox(store: Store) {
    this.openCashboxDialog(undefined, store.id);
  }

  onEditCashbox(cashbox: Cashbox) {
    this.openCashboxDialog(cashbox, cashbox.storeId);
  }

  onDeleteCashbox(cashbox: Cashbox) {
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

  private openCashboxDialog(cashbox?: Cashbox, storeId?: string) {
    const dialogRef = this.dialog.open<Cashbox, CashboxDialogData>(CashboxDialog, {
      data: { cashbox, storeId },
    });

    dialogRef.closed.pipe(takeUntilDestroyed(this.destroyRef)).subscribe((result) => {
      if (result) {
        this.reload();
      }
    });
  }

  private openDialog(store?: Store) {
    const dialogRef = this.dialog.open<StoreDialogResult>(StoreDialog, {
      data: { store },
    });

    dialogRef.closed.pipe(takeUntilDestroyed(this.destroyRef)).subscribe((result) => {
      if (!result) return;
      this.reload();
    });
  }

  reload() {
    this.stores.reload();
  }
}
