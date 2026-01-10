import { Dialog } from '@angular/cdk/dialog';
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
import { filter, switchMap, tap } from 'rxjs';
import { PriceTypesService } from '../../../../../core/services/price-types.service';
import { UiButton } from '../../../../../core/ui/ui-button/ui-button';
import { UiCard } from '../../../../../core/ui/ui-card/ui-card';
import { UiDialogConfirm } from '../../../../../core/ui/ui-dialog-confirm/ui-dialog-confirm';
import { UiDialogConfirmData } from '../../../../../core/ui/ui-dialog-confirm/ui-dialog-confirm-data.interface';
import { UiInput } from '../../../../../core/ui/ui-input/ui-input';
import { TableColumn } from '../../../../../core/ui/ui-table/table-column.interface';
import { UiTable } from '../../../../../core/ui/ui-table/ui-table';
import {
  PriceTypeDialogData,
  PriceTypeDialogResult,
} from '../../../../../shared/interfaces/dialogs/price-type-dialog.interface';
import { PriceType } from '../../../../../shared/interfaces/entities/price-type.interface';
import { PriceTypeDialog } from './price-type-dialog/price-type-dialog';

@Component({
  selector: 'app-price-types-page',
  imports: [UiButton, UiInput, UiTable, FormField, UiCard],
  templateUrl: './price-types-page.html',
  styleUrl: './price-types-page.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: {
    class: 'flex flex-col gap-4 h-full',
  },
})
export class PriceTypesPage {
  private priceTypesService = inject(PriceTypesService);
  private dialog = inject(Dialog);
  private destroyRef = inject(DestroyRef);

  // State
  selectedPriceType = signal<PriceType | undefined>(undefined);

  formState = signal({ query: '' });
  formData = form(this.formState);

  isSearchVisible = signal(false);

  // Resources
  priceTypes = this.priceTypesService.getAll();

  columns: TableColumn<PriceType>[] = [
    {
      key: 'id',
      header: 'Код',
      valueGetter: (_, index) => `000${index + 1}`,
      width: '80px',
    },
    {
      key: 'name',
      header: 'Наименование',
    },
  ];

  filteredPriceTypes = computed(() => {
    const list = this.priceTypes.value() || [];
    const query = this.formData().value().query.toLowerCase();

    if (!query) {
      return list;
    }

    return list.filter((v) => v.name.toLowerCase().includes(query));
  });

  selectPriceType(priceType?: PriceType) {
    this.selectedPriceType.set(priceType);
  }

  // Helper methods for template
  editCurrentPriceType() {
    const priceType = this.selectedPriceType();
    if (!priceType) return;
    this.openPriceTypeDialog(priceType);
  }

  deleteCurrentPriceType() {
    const priceType = this.selectedPriceType();
    if (!priceType) return;
    this.deletePriceType(priceType);
  }

  // CRUD
  openPriceTypeDialog(priceType?: PriceType) {
    const data: PriceTypeDialogData = { priceType };

    this.dialog
      .open<PriceTypeDialogResult>(PriceTypeDialog, { data, width: '400px' })
      .closed.pipe(
        filter(Boolean),
        tap(() => this.priceTypes.reload()),
        takeUntilDestroyed(this.destroyRef),
      )
      .subscribe();
  }

  deletePriceType(priceType: PriceType) {
    this.dialog
      .open<boolean, UiDialogConfirmData>(UiDialogConfirm, {
        data: {
          title: 'Удалить тип цены?',
          message: `Вы действительно хотите удалить тип цены "${priceType.name}"?`,
          variant: 'danger',
        },
        width: '400px',
      })
      .closed.pipe(
        filter(Boolean),
        switchMap(() => this.priceTypesService.delete(priceType.id)),
        tap(() => {
          this.priceTypes.reload();
          if (this.selectedPriceType()?.id === priceType.id) {
            this.selectedPriceType.set(undefined);
          }
        }),
        takeUntilDestroyed(this.destroyRef),
      )
      .subscribe();
  }
}
