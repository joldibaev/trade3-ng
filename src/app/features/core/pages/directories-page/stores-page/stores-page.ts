import { Dialog } from '@angular/cdk/dialog';
import { DatePipe } from '@angular/common';
import { ChangeDetectionStrategy, Component, DestroyRef, inject } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { RouterLink } from '@angular/router';
import { StoresService } from '../../../../../core/services/stores.service';
import { UiBreadcrumb } from '../../../../../core/ui/ui-breadcrumb/ui-breadcrumb';
import { UiButton } from '../../../../../core/ui/ui-button/ui-button';
import { UiDialogConfirm } from '../../../../../core/ui/ui-dialog-confirm/ui-dialog-confirm';
import { UiDialogConfirmData } from '../../../../../core/ui/ui-dialog-confirm/ui-dialog-confirm-data.interface';
import { UiDirectoryItemCard } from '../../../../../core/ui/ui-directory-item-card/ui-directory-item-card';
import { UiEmptyState } from '../../../../../core/ui/ui-empty-state/ui-empty-state';
import { UiIcon } from '../../../../../core/ui/ui-icon/ui-icon.component';
import { UiLoading } from '../../../../../core/ui/ui-loading/ui-loading';
import { StoreDialogResult } from '../../../../../shared/interfaces/dialogs/store-dialog.interface';
import { Store } from '../../../../../shared/interfaces/entities/store.interface';
import { StoreDialog } from './store-dialog/store-dialog';

@Component({
  selector: 'app-stores-page',
  imports: [
    UiButton,
    UiDirectoryItemCard,
    UiEmptyState,
    RouterLink,
    DatePipe,
    UiBreadcrumb,
    UiLoading,
    UiIcon,
  ],
  templateUrl: './stores-page.html',
  styleUrl: './stores-page.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: {
    class: 'flex flex-col gap-4 h-full',
  },
})
export class StoresPage {
  private storesService = inject(StoresService);
  private dialog = inject(Dialog);
  private destroyRef = inject(DestroyRef);

  stores = this.storesService.getAll({ includes: ['cashboxes'] });

  breadcrumbItems = [
    { label: 'Главная', url: '/core/dashboard' },
    { label: 'Справочники' },
    { label: 'Магазины' },
  ];

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
