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
import { filter, switchMap, tap } from 'rxjs';
import { PriceTypesService } from '../../../../../core/services/price-types.service';
import { UiDialogConfirm } from '../../../../../core/ui/ui-dialog-confirm/ui-dialog-confirm';
import { UiDialogConfirmData } from '../../../../../core/ui/ui-dialog-confirm/ui-dialog-confirm-data.interface';
import { TableColumn } from '../../../../../core/ui/ui-table/table-column.interface';
import {
  PriceTypeDialogData,
  PriceTypeDialogResult,
} from '../../../../../shared/interfaces/dialogs/price-type-dialog.interface';
import { PriceType } from '../../../../../shared/interfaces/entities/price-type.interface';
import { TableStruct } from '../../../components/table-struct/table-struct';
import { PriceTypeDialog } from './price-type-dialog/price-type-dialog';

@Component({
  selector: 'app-price-types-page',
  imports: [TableStruct],
  templateUrl: './price-types-page.html',
  styleUrl: './price-types-page.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PriceTypesPage {
  private priceTypesService = inject(PriceTypesService);
  private dialog = inject(Dialog);
  private destroyRef = inject(DestroyRef);

  // State
  selectedPriceType = signal<PriceType | undefined>(undefined);
  searchQuery = signal('');

  // Resources
  priceTypes = this.priceTypesService.getAll();

  columns: TableColumn<PriceType>[] = [
    {
      key: 'id',
      header: 'ID',
      valueGetter: (row) => row.id,
      width: '120px',
    },
    {
      key: 'name',
      header: 'Наименование',
    },
  ];

  filteredPriceTypes = computed(() => {
    const list = this.priceTypes.value() || [];
    const query = this.searchQuery().toLowerCase();

    if (!query) {
      return list;
    }

    return list.filter((v) => v.name.toLowerCase().includes(query));
  });

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
