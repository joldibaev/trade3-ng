import { DIALOG_DATA, DialogRef } from '@angular/cdk/dialog';
import { ChangeDetectionStrategy, Component, computed, inject, signal } from '@angular/core';
import { StoresService } from '../../../../../../core/services/stores.service';
import { UiButton } from '../../../../../../core/ui/ui-button/ui-button';
import { UiDialog } from '../../../../../../core/ui/ui-dialog/ui-dialog';
import { UiIcon } from '../../../../../../core/ui/ui-icon/ui-icon.component';
import { UiInput } from '../../../../../../core/ui/ui-input/ui-input';
import { Cashbox } from '../../../../../../shared/interfaces/entities/cashbox.interface';

export interface CashboxDialogData {
  cashbox?: Cashbox;
  storeId?: string;
}

export interface CashboxDialogResult {
  name: string;
  storeId: string;
}

@Component({
  selector: 'app-cashbox-dialog',
  imports: [UiInput, UiButton, UiIcon, UiDialog],
  templateUrl: './cashbox-dialog.html',
  styleUrl: './cashbox-dialog.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CashboxDialog {
  private dialogRef = inject<DialogRef<CashboxDialogResult>>(DialogRef);
  private data = inject<CashboxDialogData>(DIALOG_DATA);
  private storesService = inject(StoresService);

  stores = this.storesService.getAll();

  name = signal(this.data?.cashbox?.name ?? '');
  storeId = signal(this.data?.cashbox?.storeId ?? this.data?.storeId ?? '');
  isStoreFixed = signal(!!this.data?.storeId);

  isEdit = computed(() => !!this.data?.cashbox);
  isValid = computed(() => !!this.name() && !!this.storeId());

  close() {
    this.dialogRef.close();
  }

  save() {
    this.dialogRef.close({
      name: this.name(),
      storeId: this.storeId(),
    });
  }

  onStoreChange(event: Event) {
    const target = event.target as HTMLSelectElement;
    this.storeId.set(target.value);
  }
}
