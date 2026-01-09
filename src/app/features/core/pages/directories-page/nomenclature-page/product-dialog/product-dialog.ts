import { DIALOG_DATA, DialogRef } from '@angular/cdk/dialog';
import { ChangeDetectionStrategy, Component, computed, inject, signal } from '@angular/core';
import { Field, form } from '@angular/forms/signals';
import { CategoriesService } from '../../../../../../core/services/categories.service';
import { UiButton } from '../../../../../../core/ui/ui-button/ui-button';
import { UiDialog } from '../../../../../../core/ui/ui-dialog/ui-dialog';
import { UiIcon } from '../../../../../../core/ui/ui-icon/ui-icon.component';
import { UiInput } from '../../../../../../core/ui/ui-input/ui-input';
import { UiSelect } from '../../../../../../core/ui/ui-select/ui-select';
import { ProductDialogData } from './product-dialog-data.interface';
import { ProductDialogResult } from './product-dialog-result.interface';

@Component({
  selector: 'app-product-dialog',
  imports: [UiInput, UiButton, UiDialog, UiSelect, Field, UiIcon],
  templateUrl: './product-dialog.html',
  styleUrl: './product-dialog.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ProductDialog {
  private dialogRef = inject<DialogRef<ProductDialogResult>>(DialogRef);
  private data = inject<ProductDialogData>(DIALOG_DATA);
  private categoriesService = inject(CategoriesService);

  categories = this.categoriesService.getAll();

  formState = signal<ProductDialogResult>({
    name: this.data.product?.name ?? '',
    article: this.data.product?.article ?? '',
    categoryId: this.data.product?.categoryId ?? this.data.categoryId ?? '',
    barcodes:
      this.data.product?.barcodes.map((b) => ({
        id: b.id,
        value: b.value,
      })) ?? [],
  });

  formData = form(this.formState);

  barcodes = signal<{ id?: string; value: string }[]>(this.formState().barcodes);
  newBarcode = signal('');

  selectedCategoryList = computed(() => [this.formState().categoryId]);

  isEdit = computed(() => Boolean(this.data?.product));

  close() {
    this.dialogRef.close();
  }

  save() {
    this.formState.update((s) => ({ ...s, barcodes: this.barcodes() }));
    this.dialogRef.close(this.formState());
  }

  addBarcode() {
    const value = this.newBarcode().trim();
    if (!value) return;

    if (this.barcodes().some((b) => b.value === value)) {
      this.newBarcode.set('');
      return;
    }

    this.barcodes.update((prev) => [...prev, { value }]);
    this.newBarcode.set('');
  }

  removeBarcode(index: number) {
    this.barcodes.update((prev) => prev.filter((_, i) => i !== index));
    // also update formstate?? maybe better to just update on save
  }

  handleCategoryChange(ids: string[]) {
    if (ids.length > 0) {
      this.formState.update((v) => ({ ...v, categoryId: ids[0] }));
    }
  }
}
