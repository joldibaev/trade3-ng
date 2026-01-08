import { Dialog } from '@angular/cdk/dialog';
import { DatePipe } from '@angular/common';
import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { RouterLink } from '@angular/router';
import { StoresService } from '../../../../../core/services/stores.service';
import { UiBreadcrumb } from '../../../../../core/ui/ui-breadcrumb/ui-breadcrumb';
import { UiButton } from '../../../../../core/ui/ui-button/ui-button';
import { UiDialogConfirm } from '../../../../../core/ui/ui-dialog-confirm/ui-dialog-confirm';
import { UiDirectoryItemCard } from '../../../../../core/ui/ui-directory-item-card/ui-directory-item-card';
import { UiEmptyState } from '../../../../../core/ui/ui-empty-state/ui-empty-state';
import { UiLoading } from '../../../../../core/ui/ui-loading/ui-loading';
import { Store } from '../../../../../shared/interfaces/entities/store.interface';
import { StoreDialog, StoreDialogResult } from './store-dialog/store-dialog';

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
  ],
  templateUrl: './stores-page.html',
  styleUrl: './stores-page.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class StoresPage {
  private storesService = inject(StoresService);
  private dialog = inject(Dialog);

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
    const dialogRef = this.dialog.open<boolean>(UiDialogConfirm, {
      data: {
        title: 'Удалить магазин',
        message: `Вы уверены, что хотите удалить магазин "${store.name}"?`,
        confirmLabel: 'Удалить',
        variant: 'danger',
      },
      backdropClass: 'bg-black/30',
    });

    dialogRef.closed.subscribe((result) => {
      if (result) {
        this.storesService.delete(store.id).subscribe(() => {
          this.reload();
        });
      }
    });
  }

  private openDialog(store?: Store) {
    const dialogRef = this.dialog.open<StoreDialogResult>(StoreDialog, {
      data: { store },
      disableClose: true,
      backdropClass: 'bg-black/30',
      // panelClass: 'w-full', // Removed to allow CDK to center the pane properly based on content size
    });

    dialogRef.closed.subscribe((result) => {
      if (!result) return;

      const { name } = result;
      if (store) {
        this.storesService.update(store.id, { name }).subscribe(() => {
          this.reload();
        });
      } else {
        const newStore = {
          name,
        } as unknown as Store;
        this.storesService.create(newStore).subscribe(() => {
          this.reload();
        });
      }
    });
  }

  reload() {
    this.stores.reload();
  }
}
