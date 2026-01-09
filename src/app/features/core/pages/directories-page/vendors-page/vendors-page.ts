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
import { Field, form } from '@angular/forms/signals';
import { filter, switchMap, tap } from 'rxjs';
import { VendorsService } from '../../../../../core/services/vendors.service';
import { UiButton } from '../../../../../core/ui/ui-button/ui-button';
import { UiCard } from '../../../../../core/ui/ui-card/ui-card';
import { UiDialogConfirm } from '../../../../../core/ui/ui-dialog-confirm/ui-dialog-confirm';
import { UiDialogConfirmData } from '../../../../../core/ui/ui-dialog-confirm/ui-dialog-confirm-data.interface';
import { UiInput } from '../../../../../core/ui/ui-input/ui-input';
import { TableColumn } from '../../../../../core/ui/ui-table/table-column.interface';
import { UiTable } from '../../../../../core/ui/ui-table/ui-table';
import { Vendor } from '../../../../../shared/interfaces/entities/vendor.interface';
import { VendorDialog } from './vendor-dialog/vendor-dialog';
import { VendorDialogData } from './vendor-dialog/vendor-dialog-data.interface';
import { VendorDialogResult } from './vendor-dialog/vendor-dialog-result.interface';

@Component({
  selector: 'app-vendors-page',
  imports: [UiButton, UiInput, UiTable, Field, UiCard],
  templateUrl: './vendors-page.html',
  styleUrl: './vendors-page.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: {
    class: 'flex flex-col gap-4 h-full',
  },
})
export class VendorsPage {
  private vendorsService = inject(VendorsService);
  private dialog = inject(Dialog);
  private destroyRef = inject(DestroyRef);

  // State
  selectedVendor = signal<Vendor | undefined>(undefined);
  searchForm = form(signal({ query: '' }));
  isSearchVisible = signal(false);

  // Resources
  vendors = this.vendorsService.getAll();

  columns: TableColumn<Vendor>[] = [
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
    const query = this.searchForm().value().query.toLowerCase();

    if (!query) {
      return vendors;
    }

    return vendors.filter((v) => v.name.toLowerCase().includes(query));
  });

  selectVendor(vendor?: Vendor) {
    this.selectedVendor.set(vendor);
  }

  // Helper methods for template
  editCurrentVendor() {
    const vendor = this.selectedVendor();
    if (!vendor) return;
    this.openVendorDialog(vendor);
  }

  deleteCurrentVendor() {
    const vendor = this.selectedVendor();
    if (!vendor) return;
    this.deleteVendor(vendor);
  }

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
