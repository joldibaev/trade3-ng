import { Dialog } from '@angular/cdk/dialog';
import { DecimalPipe, SlicePipe } from '@angular/common';
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
import { VendorsService } from '../../../../../core/services/vendors.service';
import { UiBadge } from '../../../../../core/ui/ui-badge/ui-badge';
import { UiButton } from '../../../../../core/ui/ui-button/ui-button';
import { UiCard } from '../../../../../core/ui/ui-card/ui-card';
import { UiDialogConfirm } from '../../../../../core/ui/ui-dialog-confirm/ui-dialog-confirm';
import { UiDialogConfirmData } from '../../../../../core/ui/ui-dialog-confirm/ui-dialog-confirm-data.interface';
import { IconName } from '../../../../../core/ui/ui-icon/data';
import { UiIcon } from '../../../../../core/ui/ui-icon/ui-icon.component';
import { UiInput } from '../../../../../core/ui/ui-input/ui-input';
import { UiLoading } from '../../../../../core/ui/ui-loading/ui-loading';
import { UiTable } from '../../../../../core/ui/ui-table/ui-table';
import {
  VendorDialogData,
  VendorDialogResult,
} from '../../../../../shared/interfaces/dialogs/vendor-dialog.interface';
import { Vendor } from '../../../../../shared/interfaces/entities/vendor.interface';
import { VendorDialog } from './vendor-dialog/vendor-dialog';

@Component({
  selector: 'app-vendors-page',
  imports: [
    UiButton,
    UiCard,
    UiIcon,
    UiLoading,
    UiTable,
    DecimalPipe,
    UiInput,
    FormField,
    UiBadge,
    ToStringPipe,
    SlicePipe, // Added SlicePipe for ID truncation if needed
  ],
  templateUrl: './vendors-page.html',
  styleUrl: './vendors-page.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: {
    class: 'flex flex-col gap-4',
  },
})
export class VendorsPage {
  private vendorsService = inject(VendorsService);
  private dialog = inject(Dialog);
  private destroyRef = inject(DestroyRef);

  // State
  selectedVendor = signal<Vendor | undefined>(undefined);

  searchForm = form(signal({ query: '' }));

  // Resources
  vendors = this.vendorsService.getAll({ includes: ['purchases'] });

  stats = computed(() => {
    const list = this.vendors.value() || [];
    const totalPurchases = list.reduce((sum, vendor) => {
      const purchasesTotal =
        vendor.purchases?.reduce((s, purchase) => s + (purchase.total || 0), 0) || 0;
      return sum + purchasesTotal;
    }, 0);

    return [
      {
        label: 'Всего поставщиков',
        value: list.length,
        icon: 'outline-users' as IconName,
        color: 'bg-emerald-50 text-emerald-600',
      },
      {
        label: 'Активных поставщиков',
        value: list.filter((v) => v.isActive).length,
        icon: 'outline-users' as IconName,
        color: 'bg-emerald-50 text-emerald-600',
      },
      {
        label: 'Общие закупки',
        value: totalPurchases,
        icon: 'outline-users' as IconName,
        color: 'bg-emerald-50 text-emerald-600',
      },
    ];
  });

  filteredVendors = computed(() => {
    const vendors = this.vendors.value() || [];
    const query = this.searchForm().value().query.toLowerCase();

    if (!query) {
      return vendors;
    }

    return vendors.filter(
      (v) =>
        v.name.toLowerCase().includes(query) ||
        v.email?.toLowerCase().includes(query) ||
        v.phone?.toLowerCase().includes(query) ||
        v.address?.toLowerCase().includes(query),
    );
  });

  // Copy to clipboard helper
  copyToClipboard(val: string) {
    void navigator.clipboard.writeText(val);
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
          message: `Вы действительно хотите удалить поставщика "${vendor.name}"? Это действие нельзя отменить.`,
          variant: 'danger',
          confirmLabel: 'Удалить',
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

  onView(vendor: Vendor) {
    console.log('View vendor:', vendor);
  }
}
