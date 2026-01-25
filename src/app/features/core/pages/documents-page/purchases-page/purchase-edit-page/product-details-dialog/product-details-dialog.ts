import { DIALOG_DATA, DialogRef } from '@angular/cdk/dialog';
import { CurrencyPipe, DecimalPipe } from '@angular/common';
import { ChangeDetectionStrategy, Component, computed, inject, signal } from '@angular/core';
import { form, FormField, required } from '@angular/forms/signals';
import { FindPipe } from '../../../../../../../core/pipes/find-pipe';
import { UiButton } from '../../../../../../../core/ui/ui-button/ui-button';
import { UiDialog } from '../../../../../../../core/ui/ui-dialog/ui-dialog';
import { UiIcon } from '../../../../../../../core/ui/ui-icon/ui-icon.component';
import { UiInputNumber } from '../../../../../../../core/ui/ui-input/ui-input-number';
import { PriceType } from '../../../../../../../shared/interfaces/entities/price-type.interface';
import { Product } from '../../../../../../../shared/interfaces/entities/product.interface';

interface DialogData {
  product: Product;
  priceTypes: PriceType[];
}

export interface ProductDetailsResult {
  tempId: string;
  productId: string;
  productName: string;
  quantity: number;
  price: number;
  newPrices: {
    priceTypeId: string;
    name: string;
    value: number;
    currentValue: number;
  }[];
}

@Component({
  selector: 'app-product-details-dialog',
  imports: [
    UiDialog,
    UiButton,
    UiInputNumber,
    FormField,
    CurrencyPipe,
    DecimalPipe,
    FindPipe,
    UiIcon,
  ],
  templateUrl: './product-details-dialog.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ProductDetailsDialog {
  private dialogRef = inject<DialogRef<ProductDetailsResult>>(DialogRef);
  private data = inject<DialogData>(DIALOG_DATA);

  product = this.data.product;
  priceTypes = this.data.priceTypes;

  // We need a structured state for the form
  // newPrices is an object where key is priceTypeId
  formState = signal({
    quantity: 1,
    price: this.product.lastPurchasePrice || 0,
    newPrices: this.priceTypes.reduce(
      (acc, pt) => {
        const currentPrice = this.product.prices?.find((p) => p.priceTypeId === pt.id)?.value || 0;
        return { ...acc, [pt.id]: currentPrice };
      },
      {} as Record<string, number>,
    ),
  });

  formData = form(this.formState, (schema) => {
    required(schema.quantity, { message: 'Введите количество' });
    required(schema.price, { message: 'Введите цену закупа' });
  });

  // Validation: any price in newPrices < purchase price
  isPricesInvalid = computed(() => {
    const purchasePrice = this.formState().price;
    return Object.values(this.formState().newPrices).some((val) => val > 0 && val < purchasePrice);
  });

  isValid = computed(() => {
    return !this.formData().invalid() && !this.isPricesInvalid();
  });

  // Calculate percentage change for each price type
  priceChangePercentages = computed(() => {
    const state = this.formState();
    const percentages: Record<string, number> = {};

    this.priceTypes.forEach((pt) => {
      const currentPrice = this.product.prices?.find((p) => p.priceTypeId === pt.id)?.value || 0;
      const newPrice = state.newPrices[pt.id] || 0;

      if (currentPrice > 0 && newPrice > 0) {
        percentages[pt.id] = ((newPrice - currentPrice) / currentPrice) * 100;
      } else {
        percentages[pt.id] = 0;
      }
    });

    return percentages;
  });

  // Calculate percentage change for purchase price
  purchasePriceChangePercentage = computed(() => {
    const currentPrice = this.product.lastPurchasePrice || 0;
    const newPrice = this.formState().price || 0;

    if (currentPrice > 0 && newPrice > 0 && currentPrice !== newPrice) {
      return ((newPrice - currentPrice) / currentPrice) * 100;
    }
    return 0;
  });

  updateNewPrice(ptId: string, value: number) {
    this.formState.update((state) => ({
      ...state,
      newPrices: { ...state.newPrices, [ptId]: value },
    }));
  }

  save() {
    if (!this.isValid()) return;

    const state = this.formState();
    const result = {
      tempId: crypto.randomUUID(),
      productId: this.product.id,
      productName: this.product.name,
      quantity: state.quantity,
      price: state.price,
      newPrices: this.priceTypes.map((pt) => ({
        priceTypeId: pt.id,
        name: pt.name,
        value: state.newPrices[pt.id] || 0,
        currentValue: this.product.prices?.find((p) => p.priceTypeId === pt.id)?.value || 0,
      })),
    };

    this.dialogRef.close(result);
  }

  cancel() {
    this.dialogRef.close();
  }
}
