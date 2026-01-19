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
import { StoresService } from '../../../../../../core/services/stores.service';
import { UiButton } from '../../../../../../core/ui/ui-button/ui-button';
import { UiDialog } from '../../../../../../core/ui/ui-dialog/ui-dialog';
import { UiInput } from '../../../../../../core/ui/ui-input/ui-input';
import {
  StoreDialogData,
  StoreDialogResult,
} from '../../../../../../shared/interfaces/dialogs/store-dialog.interface';

import { UiSwitch } from '../../../../../../core/ui/ui-switch/ui-switch';

@Component({
  selector: 'app-store-dialog',
  imports: [UiInput, UiButton, UiDialog, FormField, FormsModule, UiSwitch],
  templateUrl: './store-dialog.html',
  styleUrl: './store-dialog.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class StoreDialog {
  private dialogRef = inject<DialogRef<StoreDialogResult>>(DialogRef);
  private data = inject<StoreDialogData>(DIALOG_DATA);

  private storesService = inject(StoresService);
  private destroyRef = inject(DestroyRef);
  loading = signal(false);

  formState = signal<StoreDialogResult>({
    name: this.data.store?.name ?? '',
    address: this.data.store?.address ?? '',
    phone: this.data.store?.phone ?? '',
    workingHours: this.data.store?.workingHours ?? '',
    isActive: this.data.store?.isActive ?? true,
  });
  formData = form(this.formState, (schemaPath) => {
    required(schemaPath.name, { message: 'Наименование обязательно' });
  });

  isEdit = computed(() => !!this.data?.store);

  close() {
    this.dialogRef.close();
  }

  save() {
    if (this.formData().invalid()) return;

    this.loading.set(true);
    const value = this.formData().value();

    const request$ = this.isEdit()
      ? this.storesService.update(this.data.store!.id, value)
      : this.storesService.create(value);

    request$
      .pipe(
        finalize(() => this.loading.set(false)),
        takeUntilDestroyed(this.destroyRef),
      )
      .subscribe(() => {
        this.dialogRef.close({
          ...value,
          isActive: value.isActive as boolean,
        } as StoreDialogResult);
      });
  }
}
