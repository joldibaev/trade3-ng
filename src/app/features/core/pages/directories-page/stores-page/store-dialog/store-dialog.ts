import { DIALOG_DATA, DialogRef } from '@angular/cdk/dialog';
import { ChangeDetectionStrategy, Component, computed, inject, signal } from '@angular/core';
import { UiButton } from '../../../../../../core/ui/ui-button/ui-button';
import { UiDialog } from '../../../../../../core/ui/ui-dialog/ui-dialog';
import { UiIcon } from '../../../../../../core/ui/ui-icon/ui-icon.component';
import { UiInput } from '../../../../../../core/ui/ui-input/ui-input';
import { Store } from '../../../../../../shared/interfaces/entities/store.interface';

export interface StoreDialogData {
  store?: Store;
}

export interface StoreDialogResult {
  name: string;
}

@Component({
  selector: 'app-store-dialog',
  imports: [UiInput, UiButton, UiIcon, UiDialog],
  templateUrl: './store-dialog.html',
  styleUrl: './store-dialog.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class StoreDialog {
  private dialogRef = inject<DialogRef<StoreDialogResult>>(DialogRef);
  private data = inject<StoreDialogData>(DIALOG_DATA);

  name = signal(this.data?.store?.name ?? '');

  isEdit = computed(() => !!this.data?.store);

  close() {
    this.dialogRef.close();
  }

  save() {
    this.dialogRef.close({
      name: this.name(),
    });
  }
}
