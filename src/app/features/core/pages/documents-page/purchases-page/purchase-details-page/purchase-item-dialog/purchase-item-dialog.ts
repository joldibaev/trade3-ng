import { DIALOG_DATA, DialogRef } from '@angular/cdk/dialog';
import { CurrencyPipe } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  computed,
  DestroyRef,
  inject,
  model,
  signal,
} from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { FormsModule } from '@angular/forms';
import { form, FormField, min, required, validate } from '@angular/forms/signals';
import { ProductsService } from '../../../../../../../core/services/products.service';
import { StoresService } from '../../../../../../../core/services/stores.service';
import { UiButton } from '../../../../../../../core/ui/ui-button/ui-button';
import { UiCheckbox } from '../../../../../../../core/ui/ui-checkbox/ui-checkbox';
import { UiDialog } from '../../../../../../../core/ui/ui-dialog/ui-dialog';
import { UiIcon } from '../../../../../../../core/ui/ui-icon/ui-icon.component';
import { UiInput } from '../../../../../../../core/ui/ui-input/ui-input';
import { UiInputNumber } from '../../../../../../../core/ui/ui-input/ui-input-number';
import { UiNotyfService } from '../../../../../../../core/ui/ui-notyf/ui-notyf.service';
import {
  CreateDocumentPurchaseItemInput,
  UpdateProductPriceInput,
} from '../../../../../../../shared/interfaces/dtos/document-purchase/create-document-purchase.interface';
import { PriceType } from '../../../../../../../shared/interfaces/entities/price-type.interface';
import { Product } from '../../../../../../../shared/interfaces/entities/product.interface';

export interface PurchaseItemDialogData {
  item?: CreateDocumentPurchaseItemInput;
  productName?: string;
  priceTypes: PriceType[];
}
@Component({
  selector: 'app-purchase-item-dialog',
  standalone: true,
  imports: [
    UiButton,
    UiInput,
    UiCheckbox,
    FormsModule,
    FormField,
    UiIcon,
    CurrencyPipe,
    UiDialog,
    UiInputNumber,
  ],
  templateUrl: './purchase-item-dialog.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PurchaseItemDialog {
  private dialogRef = inject(DialogRef);
  public data = inject<PurchaseItemDialogData>(DIALOG_DATA);
  private productsService = inject(ProductsService);
  private storesService = inject(StoresService);
  private notyf = inject(UiNotyfService);
  private destroyRef = inject(DestroyRef);

  priceTypes = signal(this.data.priceTypes);
  isPriceUpdateEnabled = model(false);

  // Products search - REMOVED
  // stored only for reference if needed, but we rely on data.item.productId

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
      if (!this.isPriceUpdateEnabled()) return null;

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

  constructor() {
    // Always load product. For new items, productId comes from the select dialog.
    const productId = this.data.item?.productId;
    if (productId) {
      this.loadProduct(productId);
    }
  }

  save() {
    if (this.formData().invalid()) {
      this.notyf.error('Пожалуйста, исправьте ошибки');
      return;
    }

    const formValue = this.formData().value();

    if (!this.isPriceUpdateEnabled()) {
      formValue.newPrices = [];
    }

    this.dialogRef.close({
      item: formValue as CreateDocumentPurchaseItemInput,
      productName: this.selectedProduct()?.name,
    });
  }

  loadProduct(id: string) {
    this.productsService
      .fetchById(id, ['prices', 'stocks', 'category'])
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe((fullProduct) => {
        this.selectedProduct.set(fullProduct);
      });
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
