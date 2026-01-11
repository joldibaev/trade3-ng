import { DecimalPipe } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  computed,
  DestroyRef,
  inject,
  signal,
} from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { applyEach, form, FormField, required } from '@angular/forms/signals';
import { ActivatedRoute, Router } from '@angular/router';
import { finalize, tap } from 'rxjs';
import { DocumentPurchasesService } from '../../../../../../core/services/document-purchases.service';
import { PriceTypesService } from '../../../../../../core/services/price-types.service';
import { ProductsService } from '../../../../../../core/services/products.service';
import { StoresService } from '../../../../../../core/services/stores.service';
import { VendorsService } from '../../../../../../core/services/vendors.service';
import { UiButton } from '../../../../../../core/ui/ui-button/ui-button';
import { UiCard } from '../../../../../../core/ui/ui-card/ui-card';
import { UiInput } from '../../../../../../core/ui/ui-input/ui-input';
import { UiSelect } from '../../../../../../core/ui/ui-select/ui-select';
import { CreateDocumentPurchaseDto } from '../../../../../../shared/interfaces/dtos/create-document-purchase.interface';
import { getCurrentDateAsString } from '../../../../../../shared/utils/get-current-date-as-string';

@Component({
  selector: 'app-purchase-form',
  imports: [UiCard, UiInput, UiSelect, UiButton, DecimalPipe, FormField, UiSelect],
  templateUrl: './purchase-form.html',
  styleUrl: './purchase-form.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: {
    class: 'flex flex-col gap-4 h-full',
  },
})
export class PurchaseForm {
  private purchasesService = inject(DocumentPurchasesService);
  private vendorsService = inject(VendorsService);
  private storesService = inject(StoresService);
  private productsService = inject(ProductsService);
  private priceTypesService = inject(PriceTypesService);
  private router = inject(Router);
  private route = inject(ActivatedRoute);
  private destroyRef = inject(DestroyRef);

  loading = signal(false);

  // Resources
  vendors = this.vendorsService.getAll();
  stores = this.storesService.getAll();
  products = this.productsService.getAll();
  priceTypes = this.priceTypesService.getAll();

  // State
  id = signal<string | undefined>(undefined);
  isEdit = computed(() => !!this.id());

  // Form State
  formState = signal<CreateDocumentPurchaseDto>({
    date: getCurrentDateAsString(), // datetime-local format
    vendorId: '',
    storeId: '',
    items: [],
  });

  formData = form(this.formState, (schemaPath) => {
    required(schemaPath.date, { message: 'Дата обязательна' });
    required(schemaPath.storeId, { message: 'Магазин обязателен' });
    required(schemaPath.vendorId, { message: 'Поставщик обязателен' });

    applyEach(schemaPath.items, (item) => {
      required(item.productId, { message: 'Товар обязателен' });
      required(item.quantity, { message: 'Кол-во обязательно' });
      required(item.price, { message: 'Цена обязательна' });

      applyEach(item.newPrices, (price) => {
        required(price.value, { message: 'Цена обязательна' });
      });
    });
  });

  totalItemsCount = computed(() => this.formData.items().value().length);

  // Computed
  totalAmount = computed(() => {
    return this.formData
      .items()
      .value()
      .reduce((acc, item) => {
        return acc + (item.quantity || 0) * (item.price || 0);
      }, 0);
  });

  constructor() {
    this.route.paramMap
      .pipe(
        tap((params) => {
          const id = params.get('id');
          if (id) {
            this.id.set(id);
            this.loadPurchase(id);
          }
        }),
      )
      .subscribe();
  }

  loadPurchase(id: string) {
    this.purchasesService.fetchById(id, ['items', 'vendor', 'store']).subscribe((purchase) => {
      // Update header
      const items = purchase.items.map((item) => {
        const validPriceTypes = this.priceTypes.value() || [];
        const product = this.products
          .value()
          ?.find((schemaPath) => schemaPath.id === item.productId);

        const newPrices = validPriceTypes.map((pt) => {
          const productPrice =
            product?.prices?.find((schemaPath) => schemaPath.priceTypeId === pt.id)?.value || 0;
          return {
            priceTypeId: pt.id,
            value: productPrice,
          };
        });

        return {
          productId: item.productId,
          quantity: item.quantity,
          price: item.price,
          newPrices,
        };
      });

      this.formData().setControlValue({
        date: purchase.date ? new Date(purchase.date).toISOString().slice(0, 16) : '',
        vendorId: purchase.vendorId || '',
        storeId: purchase.storeId,
        items,
      });
    });
  }

  addItem() {
    const validPriceTypes = this.priceTypes.value() || [];
    const newPrices = validPriceTypes.map((pt) => ({
      priceTypeId: pt.id,
      value: 0,
    }));

    this.formData.items().value.update((s) => [
      ...s,
      {
        productId: '',
        quantity: 1,
        price: 0,
        newPrices,
      },
    ]);
  }

  removeItem(index: number) {
    this.formData.items().value.update((s) => s.filter((_, i) => i !== index));
  }

  save() {
    if (this.formData().invalid()) return;

    const formValue = this.formData().value();
    if (formValue.items.length === 0) return;

    console.log(formValue);

    this.loading.set(true);

    const request$ = this.isEdit()
      ? this.purchasesService.updateDocument(this.id()!, formValue)
      : this.purchasesService.createDocument(formValue);

    request$
      .pipe(
        finalize(() => this.loading.set(false)),
        takeUntilDestroyed(this.destroyRef),
      )
      .subscribe(() => {
        this.cancel();
      });
  }

  cancel() {
    void this.router.navigate(['/core/documents/purchases']);
  }
}
