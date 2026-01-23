import { DialogRef } from '@angular/cdk/dialog';
import { DatePipe } from '@angular/common';
import { ChangeDetectionStrategy, Component, DestroyRef, inject, signal } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { FormsModule } from '@angular/forms';
import { form, FormField, required } from '@angular/forms/signals';
import { finalize } from 'rxjs/operators';
import { DocumentPurchasesService } from '../../../../../../core/services/document-purchases.service';
import { StoresService } from '../../../../../../core/services/stores.service';
import { VendorsService } from '../../../../../../core/services/vendors.service';
import { UiButton } from '../../../../../../core/ui/ui-button/ui-button';
import { UiDialog } from '../../../../../../core/ui/ui-dialog/ui-dialog';
import { UiInput } from '../../../../../../core/ui/ui-input/ui-input';
import { UiSelect } from '../../../../../../core/ui/ui-select/ui-select';
import { CreateDocumentPurchaseDto } from '../../../../../../shared/interfaces/dtos/document-purchase/create-document-purchase.interface';
import {
  formatDateToIso,
  getCurrentDateAsString,
} from '../../../../../../shared/utils/get-current-date-as-string';

@Component({
  selector: 'app-purchase-dialog',
  imports: [UiButton, UiSelect, UiDialog, FormsModule, UiInput, FormField],
  templateUrl: './purchase-dialog.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [DatePipe],
})
export class PurchaseDialog {
  private dialogRef = inject(DialogRef);
  private service = inject(DocumentPurchasesService);
  private storeService = inject(StoresService);
  private vendorService = inject(VendorsService);
  private destroyRef = inject(DestroyRef);

  // Resources
  stores = this.storeService.getAll().value;
  vendors = this.vendorService.getAll().value;

  // Form
  formState = signal({
    storeId: '',
    vendorId: '',
    date: getCurrentDateAsString(),
  });

  formData = form(this.formState, (schema) => {
    required(schema.storeId, { message: 'Выберите магазин' });
    required(schema.vendorId, { message: 'Выберите поставщика' });
    required(schema.date, { message: 'Выберите дату' });
  });

  isLoading = signal(false);

  save() {
    if (this.formData().invalid()) return;

    this.isLoading.set(true);
    const formValue = this.formData().value();

    const dto: CreateDocumentPurchaseDto = {
      storeId: formValue.storeId,
      vendorId: formValue.vendorId,
      date: formatDateToIso(formValue.date),
    };

    this.service
      .create(dto)
      .pipe(
        takeUntilDestroyed(this.destroyRef),
        finalize(() => this.isLoading.set(false)),
      )
      .subscribe({
        next: (res) => {
          this.dialogRef.close(res);
        },
      });
  }

  close() {
    this.dialogRef.close();
  }
}
