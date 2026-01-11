import { DIALOG_DATA, DialogRef } from '@angular/cdk/dialog';
import {
  ChangeDetectionStrategy,
  Component,
  computed,
  DestroyRef,
  inject,
  signal,
} from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { FormsModule } from '@angular/forms';
import { form, FormField, required } from '@angular/forms/signals';
import { finalize } from 'rxjs';
import { VendorsService } from '../../../../../../core/services/vendors.service';
import { UiButton } from '../../../../../../core/ui/ui-button/ui-button';
import { UiDialog } from '../../../../../../core/ui/ui-dialog/ui-dialog';
import { UiInput } from '../../../../../../core/ui/ui-input/ui-input';
import {
  VendorDialogData,
  VendorDialogResult,
} from '../../../../../../shared/interfaces/dialogs/vendor-dialog.interface';
import { Vendor } from '../../../../../../shared/interfaces/entities/vendor.interface';

@Component({
  selector: 'app-vendor-dialog',
  imports: [UiInput, UiButton, UiDialog, FormField, FormsModule],
  templateUrl: './vendor-dialog.html',
  styleUrl: './vendor-dialog.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class VendorDialog {
  private dialogRef = inject<DialogRef<Vendor>>(DialogRef);
  private data = inject<VendorDialogData>(DIALOG_DATA);

  formState = signal<VendorDialogResult>({
    name: this.data.vendor?.name ?? '',
    phone: this.data.vendor?.phone ?? '',
    email: this.data.vendor?.email ?? '',
    address: this.data.vendor?.address ?? '',
  });
  formData = form(this.formState, (schemaPath) => {
    required(schemaPath.name, { message: 'Наименование обязательно' });
  });

  private vendorsService = inject(VendorsService);
  private destroyRef = inject(DestroyRef);
  loading = signal(false);

  isEdit = computed(() => Boolean(this.data?.vendor));

  close() {
    this.dialogRef.close();
  }

  save() {
    if (this.formData().invalid()) return;

    this.loading.set(true);
    const value = this.formData().value();

    const request$ = this.isEdit()
      ? this.vendorsService.update(this.data.vendor!.id, value)
      : this.vendorsService.create(value);

    request$
      .pipe(
        finalize(() => this.loading.set(false)),
        takeUntilDestroyed(this.destroyRef),
      )
      .subscribe((result) => {
        this.dialogRef.close(result);
      });
  }
}
