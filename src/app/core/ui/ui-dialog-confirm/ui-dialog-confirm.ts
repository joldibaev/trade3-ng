import { DIALOG_DATA, DialogRef } from '@angular/cdk/dialog';
import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { UiButton } from '../ui-button/ui-button';
import { UiDialog } from '../ui-dialog/ui-dialog';
import { UiDialogConfirmData } from './ui-dialog-confirm-data.interface';

@Component({
  selector: 'ui-dialog-confirm',
  imports: [UiButton, UiDialog],
  templateUrl: './ui-dialog-confirm.html',
  styleUrl: './ui-dialog-confirm.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class UiDialogConfirm {
  private dialogRef = inject<DialogRef<boolean>>(DialogRef);
  data = inject<UiDialogConfirmData>(DIALOG_DATA);

  confirm() {
    this.dialogRef.close(true);
  }

  cancel() {
    this.dialogRef.close(false);
  }
}
