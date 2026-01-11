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
import { CategoriesService } from '../../../../../../core/services/categories.service';
import { UiButton } from '../../../../../../core/ui/ui-button/ui-button';
import { UiDialog } from '../../../../../../core/ui/ui-dialog/ui-dialog';
import { UiInput } from '../../../../../../core/ui/ui-input/ui-input';
import {
  CategoryDialogData,
  CategoryDialogResult,
} from '../../../../../../shared/interfaces/dialogs/category-dialog.interface';

@Component({
  selector: 'app-category-dialog',
  imports: [UiInput, UiButton, UiDialog, FormField, FormsModule],
  templateUrl: './category-dialog.html',
  styleUrl: './category-dialog.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CategoryDialog {
  private dialogRef = inject<DialogRef<CategoryDialogResult>>(DialogRef);
  private data = inject<CategoryDialogData>(DIALOG_DATA);

  formState = signal<CategoryDialogResult>({
    name: this.data.category?.name ?? '',
  });
  formData = form(this.formState, (schemaPath) => {
    required(schemaPath.name, { message: 'Наименование обязательно' });
  });

  private categoriesService = inject(CategoriesService);
  private destroyRef = inject(DestroyRef);
  loading = signal(false);

  isEdit = computed(() => Boolean(this.data?.category));

  close() {
    this.dialogRef.close();
  }

  save() {
    if (this.formData().invalid()) return;

    this.loading.set(true);
    const value = this.formData().value();

    const request$ = this.isEdit()
      ? this.categoriesService.update(this.data.category!.id, value)
      : this.categoriesService.create(value);

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
