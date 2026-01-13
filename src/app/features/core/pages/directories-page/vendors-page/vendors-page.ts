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
import { VendorsService } from '../../../../../core/services/vendors.service';
import { UiDialogConfirm } from '../../../../../core/ui/ui-dialog-confirm/ui-dialog-confirm';
import { UiDialogConfirmData } from '../../../../../core/ui/ui-dialog-confirm/ui-dialog-confirm-data.interface';
import { TableColumn } from '../../../../../core/ui/ui-table/table-column.interface';
import {
  VendorDialogData,
  VendorDialogResult,
} from '../../../../../shared/interfaces/dialogs/vendor-dialog.interface';
import { Vendor } from '../../../../../shared/interfaces/entities/vendor.interface';
import { TableStruct } from '../../../components/table-struct/table-struct';
import { VendorDialog } from './vendor-dialog/vendor-dialog';

@Component({
  selector: 'app-vendors-page',
  imports: [TableStruct],
  templateUrl: './vendors-page.html',
  styleUrl: './vendors-page.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class VendorsPage {
  private vendorsService = inject(VendorsService);
  private dialog = inject(Dialog);
  private destroyRef = inject(DestroyRef);

  // State
  selectedVendor = signal<Vendor | undefined>(undefined);
  searchQuery = signal('');

  // Resources
  vendors = this.vendorsService.getAll();

  columns: TableColumn<Vendor>[] = [
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
    {
      key: 'phone',
      header: 'Телефон',
      valueGetter: (row) => row.phone || '-',
    },
    {
      key: 'email',
      header: 'Email',
      valueGetter: (row) => row.email || '-',
    },
    {
      key: 'address',
      header: 'Адрес',
      valueGetter: (row) => row.address || '-',
    },
  ];

  filteredVendors = computed(() => {
    const vendors = this.vendors.value() || [];
    const query = this.searchQuery().toLowerCase();

    if (!query) {
      return vendors;
    }

    return vendors.filter((v) => v.name.toLowerCase().includes(query));
  });

  // CRUD
  openVendorDialog(vendor?: Vendor) {
    const data: VendorDialogData = { vendor };

    this.dialog
      .open<VendorDialogResult>(VendorDialog, { data, width: '400px' })
      .closed.pipe(
        filter(Boolean),
        tap(() => this.vendors.reload()),
        takeUntilDestroyed(this.destroyRef),
      )
      .subscribe();
  }

  deleteVendor(vendor: Vendor) {
    this.dialog
      .open<boolean, UiDialogConfirmData>(UiDialogConfirm, {
        data: {
          title: 'Удалить поставщика?',
          message: `Вы действительно хотите удалить поставщика "${vendor.name}"?`,
          variant: 'danger',
        },
        width: '400px',
      })
      .closed.pipe(
        filter(Boolean),
        switchMap(() => this.vendorsService.delete(vendor.id)),
        tap(() => {
          this.vendors.reload();
          if (this.selectedVendor()?.id === vendor.id) {
            this.selectedVendor.set(undefined);
          }
        }),
        takeUntilDestroyed(this.destroyRef),
      )
      .subscribe();
  }
}
