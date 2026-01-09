import { DIALOG_DATA, DialogRef } from '@angular/cdk/dialog';
import { ChangeDetectionStrategy, Component, computed, inject, signal } from '@angular/core';
import { Field, form } from '@angular/forms/signals';
import { CategoriesService } from '../../../../../../core/services/categories.service';
import { UiButton } from '../../../../../../core/ui/ui-button/ui-button';
import { UiDialog } from '../../../../../../core/ui/ui-dialog/ui-dialog';
import { UiInput } from '../../../../../../core/ui/ui-input/ui-input';
import { UiSelect } from '../../../../../../core/ui/ui-select/ui-select';
import { ProductDialogData } from './product-dialog-data.interface';
import { ProductDialogResult } from './product-dialog-result.interface';

@Component({
  selector: 'app-product-dialog',
  imports: [UiInput, UiButton, UiDialog, UiSelect, Field],
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
  });

  formData = form(this.formState);

  selectedCategoryList = computed(() => [this.formState().categoryId]);

  isEdit = computed(() => Boolean(this.data?.product));

  close() {
    this.dialogRef.close();
  }

  save() {
    this.dialogRef.close(this.formState());
  }

  handleCategoryChange(ids: string[]) {
    if (ids.length > 0) {
      this.formState.update((v) => ({ ...v, categoryId: ids[0] }));
    }
  }
}
