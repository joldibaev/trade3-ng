import { DIALOG_DATA, DialogRef } from '@angular/cdk/dialog';
import { ChangeDetectionStrategy, Component, computed, inject, signal } from '@angular/core';
import { Field, form } from '@angular/forms/signals';
import { UiButton } from '../../../../../../core/ui/ui-button/ui-button';
import { UiDialog } from '../../../../../../core/ui/ui-dialog/ui-dialog';
import { UiIcon } from '../../../../../../core/ui/ui-icon/ui-icon.component';
import { UiInput } from '../../../../../../core/ui/ui-input/ui-input';
import { CategoryDialogData } from './category-dialog-data.interface';
import { CategoryDialogResult } from './category-dialog-result.interface';

@Component({
  selector: 'app-category-dialog',
  imports: [UiInput, UiButton, UiIcon, UiDialog, Field],
  templateUrl: './category-dialog.html',
  styleUrl: './category-dialog.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CategoryDialog {
  private dialogRef = inject<DialogRef<CategoryDialogResult>>(DialogRef);
  private data = inject<CategoryDialogData>(DIALOG_DATA);

  formData = form(
    signal<CategoryDialogResult>({
      name: this.data.category?.name ?? '',
    }),
  );

  isEdit = computed(() => Boolean(this.data?.category));

  close() {
    this.dialogRef.close();
  }

  save() {
    this.dialogRef.close(this.formData().value());
  }
}
