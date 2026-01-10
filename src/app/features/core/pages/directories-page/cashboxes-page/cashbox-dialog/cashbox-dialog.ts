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
import { CashboxesService } from '../../../../../../core/services/cashboxes.service';
import { StoresService } from '../../../../../../core/services/stores.service';
import { UiButton } from '../../../../../../core/ui/ui-button/ui-button';
import { UiDialog } from '../../../../../../core/ui/ui-dialog/ui-dialog';
import { UiInput } from '../../../../../../core/ui/ui-input/ui-input';
import { UiSelect } from '../../../../../../core/ui/ui-select/ui-select';
import {
  CashboxDialogData,
  CashboxDialogResult,
} from '../../../../../../shared/interfaces/dialogs/cashbox-dialog.interface';

@Component({
  selector: 'app-cashbox-dialog',
  imports: [UiInput, UiButton, UiDialog, UiSelect, FormField, FormsModule],
  templateUrl: './cashbox-dialog.html',
  styleUrl: './cashbox-dialog.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CashboxDialog {
  private dialogRef = inject<DialogRef<CashboxDialogResult>>(DialogRef);
  private data = inject<CashboxDialogData>(DIALOG_DATA);
  private storesService = inject(StoresService);
  private destroyRef = inject(DestroyRef);

  private cashboxesService = inject(CashboxesService);
  loading = signal(false);

  stores = this.storesService.getAll();

  formState = signal<CashboxDialogResult>({
    name: this.data.cashbox?.name ?? '',
    storeId: this.data.storeId ?? '',
  });
  formData = form(this.formState, (schemaPath) => {
    required(schemaPath.name, { message: 'Наименование обязательно' });
  });

  selectedList = computed(() => [this.formData().value().storeId]);

  isEdit = computed(() => Boolean(this.data?.cashbox));

  close() {
    this.dialogRef.close();
  }

  save() {
    if (!this.formData().valid()) return;

    this.loading.set(true);
    const value = this.formData().value();

    const request$ = this.isEdit()
      ? this.cashboxesService.update(this.data.cashbox!.id, value)
      : this.cashboxesService.create(value);

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
