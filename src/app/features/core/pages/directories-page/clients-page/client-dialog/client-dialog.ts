import { DIALOG_DATA, DialogRef } from '@angular/cdk/dialog';
import { ChangeDetectionStrategy, Component, computed, inject, signal } from '@angular/core';
import { Field, form } from '@angular/forms/signals';
import { UiButton } from '../../../../../../core/ui/ui-button/ui-button';
import { UiDialog } from '../../../../../../core/ui/ui-dialog/ui-dialog';
import { UiInput } from '../../../../../../core/ui/ui-input/ui-input';
import { ClientDialogData } from './client-dialog-data.interface';
import { ClientDialogResult } from './client-dialog-result.interface';

@Component({
  selector: 'app-client-dialog',
  imports: [UiInput, UiButton, UiDialog, Field],
  templateUrl: './client-dialog.html',
  styleUrl: './client-dialog.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ClientDialog {
  private dialogRef = inject<DialogRef<ClientDialogResult>>(DialogRef);
  private data = inject<ClientDialogData>(DIALOG_DATA);

  formData = form(
    signal<ClientDialogResult>({
      name: this.data.client?.name ?? '',
      phone: this.data.client?.phone ?? '',
      email: this.data.client?.email ?? '',
      address: this.data.client?.address ?? '',
    }),
  );

  isEdit = computed(() => Boolean(this.data?.client));

  close() {
    this.dialogRef.close();
  }

  save() {
    this.dialogRef.close(this.formData().value());
  }
}
