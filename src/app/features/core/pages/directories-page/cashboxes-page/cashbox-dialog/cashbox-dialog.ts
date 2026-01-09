import { DIALOG_DATA, DialogRef } from '@angular/cdk/dialog';
import { ChangeDetectionStrategy, Component, computed, inject, signal } from '@angular/core';
import { Field, form } from '@angular/forms/signals';
import { StoresService } from '../../../../../../core/services/stores.service';
import { UiButton } from '../../../../../../core/ui/ui-button/ui-button';
import { UiDialog } from '../../../../../../core/ui/ui-dialog/ui-dialog';
import { UiInput } from '../../../../../../core/ui/ui-input/ui-input';
import { UiSelect } from '../../../../../../core/ui/ui-select/ui-select';
import { CashboxDialogData } from './cashbox-dialog-data.interface';
import { CashboxDialogResult } from './cashbox-dialog-result.interface';

@Component({
  selector: 'app-cashbox-dialog',
  imports: [UiInput, UiButton, UiDialog, UiSelect, Field],
  templateUrl: './cashbox-dialog.html',
  styleUrl: './cashbox-dialog.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CashboxDialog {
  private dialogRef = inject<DialogRef<CashboxDialogResult>>(DialogRef);
  private data = inject<CashboxDialogData>(DIALOG_DATA);
  private storesService = inject(StoresService);

  stores = this.storesService.getAll();

  formData = form(
    signal<CashboxDialogResult>({
      name: this.data.cashbox?.name ?? '',
      storeId: this.data.storeId ?? '',
    }),
  );

  selectedList = computed(() => [this.formData().value().storeId]);

  isEdit = computed(() => Boolean(this.data?.cashbox));

  close() {
    this.dialogRef.close();
  }

  save() {
    this.dialogRef.close(this.formData().value());
  }
}
