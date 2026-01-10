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
import { PriceTypesService } from '../../../../../../core/services/price-types.service';
import { UiButton } from '../../../../../../core/ui/ui-button/ui-button';
import { UiDialog } from '../../../../../../core/ui/ui-dialog/ui-dialog';
import { UiInput } from '../../../../../../core/ui/ui-input/ui-input';
import {
  PriceTypeDialogData,
  PriceTypeDialogResult,
} from '../../../../../../shared/interfaces/dialogs/price-type-dialog.interface';

@Component({
  selector: 'app-price-type-dialog',
  imports: [UiInput, UiButton, UiDialog, FormField, FormsModule],
  templateUrl: './price-type-dialog.html',
  styleUrl: './price-type-dialog.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PriceTypeDialog {
  private dialogRef = inject<DialogRef<PriceTypeDialogResult>>(DialogRef);
  private data = inject<PriceTypeDialogData>(DIALOG_DATA);

  formState = signal<PriceTypeDialogResult>({
    name: this.data.priceType?.name ?? '',
  });
  formData = form(this.formState, (schemaPath) => {
    required(schemaPath.name, { message: 'Наименование обязательно' });
  });

  private priceTypesService = inject(PriceTypesService);
  private destroyRef = inject(DestroyRef);
  loading = signal(false);

  isEdit = computed(() => Boolean(this.data?.priceType));

  close() {
    this.dialogRef.close();
  }

  save() {
    if (!this.formData().valid()) return;

    this.loading.set(true);
    const value = this.formData().value();

    const request$ = this.isEdit()
      ? this.priceTypesService.update(this.data.priceType!.id, value)
      : this.priceTypesService.create(value);

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
