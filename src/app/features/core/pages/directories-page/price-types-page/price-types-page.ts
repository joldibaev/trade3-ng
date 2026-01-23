import { Dialog } from '@angular/cdk/dialog';
import {
  CdkCell,
  CdkCellDef,
  CdkColumnDef,
  CdkHeaderCell,
  CdkHeaderCellDef,
  CdkHeaderRow,
  CdkHeaderRowDef,
  CdkNoDataRow,
  CdkRow,
  CdkRowDef,
} from '@angular/cdk/table';
import { SlicePipe } from '@angular/common';
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
import { ToStringPipe } from '../../../../../core/pipes/to-string-pipe';
import { PriceTypesService } from '../../../../../core/services/price-types.service';
import { UiBadge } from '../../../../../core/ui/ui-badge/ui-badge';
import { UiButton } from '../../../../../core/ui/ui-button/ui-button';
import { UiCard } from '../../../../../core/ui/ui-card/ui-card';
import { UiDialogConfirm } from '../../../../../core/ui/ui-dialog-confirm/ui-dialog-confirm';
import { UiDialogConfirmData } from '../../../../../core/ui/ui-dialog-confirm/ui-dialog-confirm-data.interface';
import { UiEmptyState } from '../../../../../core/ui/ui-empty-state/ui-empty-state';
import { IconName } from '../../../../../core/ui/ui-icon/data';
import { UiIcon } from '../../../../../core/ui/ui-icon/ui-icon.component';
import { UiInput } from '../../../../../core/ui/ui-input/ui-input';
import { UiLoading } from '../../../../../core/ui/ui-loading/ui-loading';
import { UiTable } from '../../../../../core/ui/ui-table/ui-table';
import {
  PriceTypeDialogData,
  PriceTypeDialogResult,
} from '../../../../../shared/interfaces/dialogs/price-type-dialog.interface';
import { PriceType } from '../../../../../shared/interfaces/entities/price-type.interface';
import { PriceTypeDialog } from './price-type-dialog/price-type-dialog';

@Component({
  selector: 'app-price-types-page',
  imports: [
    UiButton,
    UiCard,
    UiIcon,
    UiLoading,
    UiInput,
    FormField,
    UiTable,
    CdkColumnDef,
    CdkHeaderCellDef,
    CdkHeaderCell,
    CdkCellDef,
    CdkCell,
    CdkHeaderRow,
    CdkHeaderRowDef,
    CdkRowDef,
    CdkRow,
    UiBadge,
    CdkNoDataRow,
    UiEmptyState,
    SlicePipe,
    ToStringPipe,
  ],
  templateUrl: './price-types-page.html',
  styleUrl: './price-types-page.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: {
    class: 'flex flex-col gap-4',
  },
})
export class PriceTypesPage {
  private priceTypesService = inject(PriceTypesService);
  private dialog = inject(Dialog);
  private destroyRef = inject(DestroyRef);

  displayedColumns: (keyof PriceType | 'action')[] = ['id', 'name', 'isActive', 'action'];

  // State
  selectedPriceType = signal<PriceType | undefined>(undefined);

  searchForm = form(signal({ query: '' }));

  // Resources
  priceTypes = this.priceTypesService.getAll();

  stats = computed(() => {
    const list = this.priceTypes.value() || [];

    return [
      {
        label: 'Всего типов цен',
        value: list.length,
        icon: 'outline-tag' as IconName,
        color: 'bg-primary-50 text-emerald-600',
      },
      {
        label: 'Активных типов',
        value: list.filter((v) => v.isActive).length,
        icon: 'outline-check' as IconName,
        color: 'bg-primary-50 text-emerald-600',
      },
    ];
  });

  filteredPriceTypes = computed(() => {
    const list = this.priceTypes.value() || [];
    const query = this.searchForm().value().query.toLowerCase();

    if (!query) {
      return list;
    }

    return list.filter((v) => v.name.toLowerCase().includes(query));
  });

  // Copy to clipboard helper
  copyToClipboard(val: string) {
    void navigator.clipboard.writeText(val);
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
          message: `Вы действительно хотите удалить тип цены "${priceType.name}"? Это действие нельзя отменить.`,
          variant: 'danger',
          confirmLabel: 'Удалить',
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
