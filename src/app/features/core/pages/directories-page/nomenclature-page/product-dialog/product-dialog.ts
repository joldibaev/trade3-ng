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
import { finalize, forkJoin, map, of, switchMap } from 'rxjs';
import { BarcodesService } from '../../../../../../core/services/barcodes.service';
import { CategoriesService } from '../../../../../../core/services/categories.service';
import { ProductsService } from '../../../../../../core/services/products.service';
import { UiButton } from '../../../../../../core/ui/ui-button/ui-button';
import { UiDialog } from '../../../../../../core/ui/ui-dialog/ui-dialog';
import { UiIcon } from '../../../../../../core/ui/ui-icon/ui-icon.component';
import { UiInput } from '../../../../../../core/ui/ui-input/ui-input';
import { UiSelect } from '../../../../../../core/ui/ui-select/ui-select';
import {
  ProductDialogData,
  ProductDialogResult,
} from '../../../../../../shared/interfaces/dialogs/product-dialog.interface';
import { Product } from '../../../../../../shared/interfaces/entities/product.interface';

@Component({
  selector: 'app-product-dialog',
  imports: [UiInput, UiButton, UiDialog, UiSelect, FormField, UiIcon, FormsModule],
  templateUrl: './product-dialog.html',
  styleUrl: './product-dialog.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ProductDialog {
  private dialogRef = inject<DialogRef<Product>>(DialogRef);
  private data = inject<ProductDialogData>(DIALOG_DATA);
  private categoriesService = inject(CategoriesService);
  private productsService = inject(ProductsService);
  private barcodesService = inject(BarcodesService);
  private destroyRef = inject(DestroyRef);

  categories = this.categoriesService.getAll();
  loading = signal(false);

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

  formData = form(this.formState, (schemaPath) => {
    required(schemaPath.name, { message: 'Наименование обязательно' });
    required(schemaPath.article, { message: 'Артикул обязателен' });
    required(schemaPath.categoryId, { message: 'Категория обязателена' });
  });

  barcodes = signal<{ id?: string; value: string }[]>(this.formState().barcodes);

  newBarcodeState = signal({ value: '' });
  newBarcodeForm = form(this.newBarcodeState, (schemaPath) => {
    required(schemaPath.value, { message: 'Штрихкод обязателен' });
  });

  isEdit = computed(() => Boolean(this.data?.product));

  close() {
    this.dialogRef.close();
  }

  save() {
    this.formState.update((s) => ({ ...s, barcodes: this.barcodes() }));

    if (this.formData().invalid()) return;

    this.loading.set(true);
    const { barcodes: _, ...payload } = this.formState();

    const product$ = this.isEdit()
      ? this.productsService.update(this.data.product!.id, payload)
      : this.productsService.create(payload);

    product$
      .pipe(
        switchMap((savedProduct) => {
          const currentBarcodes = this.barcodes();
          const originalBarcodes = this.data.product?.barcodes || [];

          const added = currentBarcodes.filter((b) => !b.id);
          const removed = originalBarcodes.filter(
            (ob) => !currentBarcodes.find((cb) => cb.id === ob.id),
          );

          const tasks = [
            ...added.map((b) =>
              this.barcodesService.create({
                value: b.value,
                productId: savedProduct.id,
              }),
            ),
            ...removed.map((b) => this.barcodesService.delete(b.id!)),
          ];

          return tasks.length ? forkJoin(tasks).pipe(map(() => savedProduct)) : of(savedProduct);
        }),
        finalize(() => this.loading.set(false)),
        takeUntilDestroyed(this.destroyRef),
      )
      .subscribe((result) => {
        this.dialogRef.close(result);
      });
  }

  addBarcode() {
    const value = this.newBarcodeState().value.trim();
    if (!value) return;

    if (this.barcodes().some((b) => b.value === value)) {
      this.newBarcodeState.set({ value: '' });
      return;
    }

    this.barcodes.update((prev) => [...prev, { value }]);
    this.newBarcodeState.set({ value: '' });
  }

  removeBarcode(index: number) {
    this.barcodes.update((prev) => prev.filter((_, i) => i !== index));
  }
}
