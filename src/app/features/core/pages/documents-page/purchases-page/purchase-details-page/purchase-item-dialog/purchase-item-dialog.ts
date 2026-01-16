import { DIALOG_DATA, DialogRef } from '@angular/cdk/dialog';
import { CurrencyPipe } from '@angular/common';
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
import { form, FormField, min, required, validate } from '@angular/forms/signals';
import { ProductsService } from '../../../../../../../core/services/products.service';
import { StoresService } from '../../../../../../../core/services/stores.service';
import { UiAutocomplete } from '../../../../../../../core/ui/ui-autocomplete/ui-autocomplete';
import { UiButton } from '../../../../../../../core/ui/ui-button/ui-button';
import { UiInput } from '../../../../../../../core/ui/ui-input/ui-input';
import { UiNotyfService } from '../../../../../../../core/ui/ui-notyf/ui-notyf.service';
import { PriceType } from '../../../../../../../shared/interfaces/entities/price-type.interface';
import { Product } from '../../../../../../../shared/interfaces/entities/product.interface';

import { UiIcon } from '../../../../../../../core/ui/ui-icon/ui-icon.component';
import {
  CreateDocumentPurchaseItemInput,
  UpdateProductPriceInput,
} from '../../../../../../../shared/interfaces/dtos/document-purchase/create-document-purchase.interface';

export interface PurchaseItemDialogData {
  item?: CreateDocumentPurchaseItemInput;
  productName?: string;
  priceTypes: PriceType[];
}

@Component({
  selector: 'app-purchase-item-dialog',
  standalone: true,
  imports: [UiButton, UiInput, UiAutocomplete, FormsModule, FormField, UiIcon, CurrencyPipe],
  templateUrl: './purchase-item-dialog.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: { class: 'block w-[600px] rounded-lg bg-white p-6 shadow-xl' },
})
export class PurchaseItemDialog {
  private dialogRef = inject(DialogRef);
  public data = inject<PurchaseItemDialogData>(DIALOG_DATA);
  private productsService = inject(ProductsService);
  private storesService = inject(StoresService);
  private notyf = inject(UiNotyfService);
  private destroyRef = inject(DestroyRef);

  priceTypes = signal(this.data.priceTypes);

  // Products search
  searchQuery = signal('');
  products = this.productsService.search(this.searchQuery);

  // Stores separate request
  stores = this.storesService.getAll();

  selectedProduct = signal<Product | undefined>(undefined);

  totalStock = computed(
    () => this.selectedProduct()?.stocks?.reduce((acc, s) => acc + Number(s.quantity || 0), 0) || 0,
  );

  // Form
  formState = signal<CreateDocumentPurchaseItemInput>(
    this.data.item || {
      productId: '',
      quantity: 1,
      price: 0,
      newPrices: this.data.priceTypes.map((pt) => ({ priceTypeId: pt.id, value: 0 })),
    },
  );

  formData = form(this.formState, (schema) => {
    required(schema.productId, { message: 'Выберите товар' });
    required(schema.quantity, { message: 'Введите количество' });
    min(schema.quantity, 1, { message: 'Минимум 1' });

    required(schema.price, { message: 'Введите цену' });
    min(schema.price, 0, { message: 'Не может быть отрицательной' });

    validate(schema.newPrices, ({ value, valueOf }) => {
      const newPrices = value();
      const costPrice = valueOf(schema.price);

      if (!newPrices || !costPrice) return null;

      const invalidPrice = newPrices.find((np: UpdateProductPriceInput) => np.value < costPrice);
      if (invalidPrice) {
        return { kind: 'priceError', message: 'Розничная цена не может быть ниже закупочной' };
      }

      return null;
    });
  });

  save() {
    if (this.formData().invalid()) {
      this.notyf.error('Пожалуйста, исправьте ошибки');
      return;
    }

    const formValue = this.formData().value();

    this.dialogRef.close({
      item: formValue as CreateDocumentPurchaseItemInput,
      productName: this.selectedProduct()?.name,
    });
  }

  onProductSelect(id: string) {
    if (!id) return;
    const product = this.products.value()?.find((p) => p.id === id);
    if (product) {
      // We also need to clear search query if we want to reset autocomplete state effectively
      this.searchQuery.set('');

      this.productsService
        .fetchById(id, ['prices', 'stocks', 'category'])
        .pipe(takeUntilDestroyed(this.destroyRef))
        .subscribe((fullProduct) => {
          this.selectedProduct.set(fullProduct);
        });
    }
  }

  clearProduct() {
    this.selectedProduct.set(undefined);
    this.formState.update((s) => ({ ...s, productId: '' }));
    this.searchQuery.set('');
  }

  cancel() {
    this.dialogRef.close();
  }

  // Helpers for dynamic fields
  getPriceTypeName(priceTypeId: string): string {
    return this.priceTypes().find((pt) => pt.id === priceTypeId)?.name || 'Цена';
  }

  getPriceValue(priceTypeId: string): number {
    return (
      this.formState().newPrices?.find(
        (p: UpdateProductPriceInput) => p.priceTypeId === priceTypeId,
      )?.value || 0
    );
  }

  updatePrice(priceTypeId: string, val: number) {
    this.formState.update((state) => {
      const newPrices: UpdateProductPriceInput[] = [...(state.newPrices || [])];
      const index = newPrices.findIndex(
        (np: UpdateProductPriceInput) => np.priceTypeId === priceTypeId,
      );
      if (index >= 0) {
        newPrices[index] = { ...newPrices[index], value: val };
      } else {
        newPrices.push({ priceTypeId, value: val });
      }
      return { ...state, newPrices };
    });
  }
}
