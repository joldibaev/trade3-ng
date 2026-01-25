import { DialogRef } from '@angular/cdk/dialog';
import { ChangeDetectionStrategy, Component, DestroyRef, inject, signal } from '@angular/core';
import { takeUntilDestroyed, toObservable } from '@angular/core/rxjs-interop';
import { form, FormField } from '@angular/forms/signals';
import { debounceTime, distinctUntilChanged } from 'rxjs';
import { ProductsService } from '../../../../../../../core/services/products.service';
import { UiButton } from '../../../../../../../core/ui/ui-button/ui-button';
import { UiDialog } from '../../../../../../../core/ui/ui-dialog/ui-dialog';
import { UiInput } from '../../../../../../../core/ui/ui-input/ui-input';
import { UiListbox } from '../../../../../../../core/ui/ui-listbox/ui-listbox';
import { Product } from '../../../../../../../shared/interfaces/entities/product.interface';

@Component({
  selector: 'app-product-select-dialog',

  imports: [UiInput, UiButton, FormField, UiListbox, UiDialog],
  templateUrl: './product-select-dialog.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ProductSelectDialog {
  private dialogRef = inject<DialogRef<Product>>(DialogRef);
  private productsService = inject(ProductsService);
  private destroyRef = inject(DestroyRef);

  formState = signal({ search: '' });
  formData = form(this.formState);

  searchQuery = signal(''); // Bound to API request
  products = this.productsService.search(this.searchQuery);
  selectedProduct = signal<Product | undefined>(undefined);

  fullProduct = this.productsService.getById(() => this.selectedProduct()?.id);
  lastPrice = this.productsService.getLastPurchasePrice(() => this.selectedProduct()?.id);

  private query$ = toObservable(this.formState);

  constructor() {
    this.query$
      .pipe(debounceTime(300), distinctUntilChanged(), takeUntilDestroyed(this.destroyRef))
      .subscribe(({ search }) => {
        this.searchQuery.set(search);
      });
  }

  onSelect(id: string) {
    const product = this.products.value()?.find((p) => p.id === id);
    this.selectedProduct.set(product);
  }

  next() {
    if (!this.fullProduct.hasValue() || !this.lastPrice.hasValue()) return;

    const product = this.fullProduct.value();

    // Включаем последнюю цену в объект товара перед возвратом
    const result = {
      ...product,
      lastPurchasePrice: this.lastPrice.value(),
    };

    this.dialogRef.close(result);
  }

  cancel() {
    this.dialogRef.close();
  }
}
