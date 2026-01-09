import { DIALOG_DATA, DialogRef } from '@angular/cdk/dialog';
import { ChangeDetectionStrategy, Component, computed, inject, signal } from '@angular/core';
import { Field, form } from '@angular/forms/signals';
import { UiButton } from '../../../../../../core/ui/ui-button/ui-button';
import { UiDialog } from '../../../../../../core/ui/ui-dialog/ui-dialog';
import { UiInput } from '../../../../../../core/ui/ui-input/ui-input';
import { VendorDialogData } from './vendor-dialog-data.interface';
import { VendorDialogResult } from './vendor-dialog-result.interface';

@Component({
  selector: 'app-vendor-dialog',
  imports: [UiInput, UiButton, UiDialog, Field],
  templateUrl: './vendor-dialog.html',
  styleUrl: './vendor-dialog.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class VendorDialog {
  private dialogRef = inject<DialogRef<VendorDialogResult>>(DialogRef);
  private data = inject<VendorDialogData>(DIALOG_DATA);

  formData = form(
    signal<VendorDialogResult>({
      name: this.data.vendor?.name ?? '',
      phone: this.data.vendor?.phone ?? '',
      email: this.data.vendor?.email ?? '',
      address: this.data.vendor?.address ?? '',
    }),
  );

  isEdit = computed(() => Boolean(this.data?.vendor));

  close() {
    this.dialogRef.close();
  }

  save() {
    this.dialogRef.close(this.formData().value());
  }
}
