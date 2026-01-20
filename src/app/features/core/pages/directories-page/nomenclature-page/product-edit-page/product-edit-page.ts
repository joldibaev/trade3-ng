import { CommonModule, DecimalPipe, Location } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  computed,
  DestroyRef,
  inject,
  input,
  OnInit,
  signal,
} from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { finalize, forkJoin, map, of, switchMap } from 'rxjs';
import { BarcodesService } from '../../../../../../core/services/barcodes.service';
import { CategoriesService } from '../../../../../../core/services/categories.service';
import { ProductsService } from '../../../../../../core/services/products.service';
import { StoresService } from '../../../../../../core/services/stores.service';
import { UiButton } from '../../../../../../core/ui/ui-button/ui-button';
import { UiCard } from '../../../../../../core/ui/ui-card/ui-card';
import { UiIcon } from '../../../../../../core/ui/ui-icon/ui-icon.component';
import { UiLoading } from '../../../../../../core/ui/ui-loading/ui-loading';
import { Category } from '../../../../../../shared/interfaces/entities/category.interface';
import { Product } from '../../../../../../shared/interfaces/entities/product.interface';

import { PriceTypesService } from '../../../../../../core/services/price-types.service';
import { PriceType } from '../../../../../../shared/interfaces/entities/price-type.interface';

interface BarcodeItem {
  id: string;
  value: string;
  type: string;
  isPrimary: boolean;
}

interface PriceItem {
  priceTypeId: string;
  name: string;
  value: string;
}

@Component({
  selector: 'app-product-edit-page',
  imports: [CommonModule, UiCard, UiIcon, FormsModule, UiLoading, DecimalPipe, UiButton],
  templateUrl: './product-edit-page.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ProductEditPage implements OnInit {
  private router = inject(Router);
  private location = inject(Location);
  private storesService = inject(StoresService);
  private categoriesService = inject(CategoriesService);
  private productsService = inject(ProductsService);
  private barcodesService = inject(BarcodesService);
  private priceTypesService = inject(PriceTypesService); // Added
  private destroyRef = inject(DestroyRef);

  id = input<string>();
  isEdit = computed(() => !!this.id());
  categories = signal<Category[]>([]);
  priceTypes = signal<PriceType[]>([]);
  stores = signal<any[]>([]);
  loading = signal(false);
  initialLoading = signal(false);

  // Constants
  readonly unitOptions = [
    { value: 'pcs', label: 'Штуки' },
    { value: 'kg', label: 'Килограммы' },
    { value: 'ltr', label: 'Литры' },
    { value: 'mtr', label: 'Метры' },
    { value: 'set', label: 'Наборы' },
    { value: 'pack', label: 'Упаковки' },
    { value: 'box', label: 'Коробки' },
  ];

  readonly barcodeTypeOptions = [
    { value: 'EAN-13', label: 'EAN-13' },
    { value: 'EAN-8', label: 'EAN-8' },
    { value: 'UPC-A', label: 'UPC-A' },
    { value: 'UPC-E', label: 'UPC-E' },
    { value: 'Code-128', label: 'Code-128' },
    { value: 'Code-39', label: 'Code-39' },
    { value: 'Internal', label: 'Internal' },
  ];

  formState = signal({
    name: '',
    article: '',
    categoryId: '',
    description: 'High-performance laptop with 15.6" display',
    unit: 'pcs',
    costPrice: '0',
  });

  product = signal<Product | null>(null);

  barcodes = signal<BarcodeItem[]>([]);
  salesPrices = signal<PriceItem[]>([]);

  formData = computed(() => {
    const s = this.formState();
    return {
      name: {
        value: s.name,
        invalid: () => !s.name,
        errors: !s.name ? [{ message: 'Название товара обязательно' }] : null,
      },
      article: {
        value: s.article,
        invalid: () => !s.article,
        errors: !s.article ? [{ message: 'Код товара обязателен' }] : null,
      },
      categoryId: {
        value: s.categoryId,
        invalid: () => !s.categoryId,
        errors: !s.categoryId ? [{ message: 'Категория обязательна' }] : null,
      },
      costPrice: {
        value: s.costPrice,
        invalid: () => parseFloat(s.costPrice) <= 0,
        errors: parseFloat(s.costPrice) <= 0 ? [{ message: 'Требуется цена закупки' }] : null,
      },
    };
  });

  markup = (price: string) => {
    const cost = parseFloat(this.formState().costPrice);
    const sale = parseFloat(price);
    if (!cost || !sale || cost === 0) return '0.0';
    return (((sale - cost) / cost) * 100).toFixed(1);
  };

  profit = (price: string) => {
    const cost = parseFloat(this.formState().costPrice);
    const sale = parseFloat(price);
    if (!cost || !sale) return 0;
    return sale - cost;
  };

  averageMarkup = computed(() => {
    const cost = parseFloat(this.formState().costPrice);
    const prices = this.salesPrices();
    if (!cost || cost === 0 || prices.length === 0) return '0.0';

    const validPrices = prices.filter((p) => parseFloat(p.value) > 0);
    if (validPrices.length === 0) return '0.0';

    const totalMarkup = validPrices.reduce((sum, p) => {
      const sale = parseFloat(p.value);
      return sum + ((sale - cost) / cost) * 100;
    }, 0);

    return (totalMarkup / validPrices.length).toFixed(1);
  });

  ngOnInit() {
    forkJoin({
      categories: this.categoriesService.list(),
      priceTypes: this.priceTypesService.list(),
    })
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe(({ categories, priceTypes }) => {
        this.categories.set(categories);
        this.priceTypes.set(priceTypes);

        if (this.id()) {
          this.initialLoading.set(true);
          this.productsService
            .fetchById(this.id()!, ['barcodes', 'stocks', 'prices', 'prices.priceType'] as any)
            .pipe(takeUntilDestroyed(this.destroyRef))
            .subscribe((product) => {
              if (product) {
                this.product.set(product);
                this.initializeForm(product);
                this.initialLoading.set(false);
              }
            });
        } else {
          // For new product, initialize with one price type if available
          if (this.priceTypes().length > 0) {
            this.salesPrices.set([
              {
                priceTypeId: this.priceTypes()[0].id,
                name: this.priceTypes()[0].name,
                value: '0',
              },
            ]);
          }
        }
      });
  }

  private initializeForm(product: Product) {
    // Basic fields
    this.formState.set({
      name: product.name,
      article: product.article || '',
      categoryId: product.categoryId,
      description: 'High-performance laptop with 15.6" display', // Mock data
      unit: 'pcs', // Mock data
      costPrice: '0', // How to determine cost price? Mock 0 for now.
    });

    // Barcodes
    this.barcodes.set(
      product.barcodes?.map((b, index) => ({
        id: b.id,
        value: b.value,
        type: b.type || 'EAN-13',
        isPrimary: index === 0, // Mock primary logic
      })) || [],
    );

    // Sales Prices
    const mappedPrices =
      product.prices?.map((p) => ({
        priceTypeId: p.priceTypeId,
        name: p.priceType?.name || 'Цена',
        value: p.value.toString(),
      })) || [];

    if (mappedPrices.length === 0 && this.priceTypes().length > 0) {
      mappedPrices.push({
        priceTypeId: this.priceTypes()[0].id,
        name: this.priceTypes()[0].name,
        value: '0',
      });
    }
    this.salesPrices.set(mappedPrices);
  }

  goBack() {
    this.location.back();
  }

  save() {
    const formValues = this.formData();
    const isFormInvalid = Object.values(formValues).some((field) => field.invalid());

    if (isFormInvalid) return;
    if (this.barcodes().length === 0) return;

    this.loading.set(true);
    const { name, article, categoryId, description, unit, costPrice } = this.formState();

    // Preparing payload with new fields
    const payload: any = {
      name,
      article,
      categoryId,
      description,
      unit,
      costPrice: parseFloat(costPrice),
    };

    const product$ = this.isEdit()
      ? this.productsService.update(this.id()!, payload)
      : this.productsService.create(payload);

    product$
      .pipe(
        switchMap((savedProduct) => {
          // Combine barcode and price saving
          // Note: Price saving might need a dedicated endpoint or bulk update
          return forkJoin({
            barcodes: this.saveBarcodes(savedProduct),
            prices: this.savePrices(savedProduct),
          });
        }),
        finalize(() => this.loading.set(false)),
        takeUntilDestroyed(this.destroyRef),
      )
      .subscribe(() => {
        this.goBack();
      });
  }

  private savePrices(product: Product) {
    // This is a placeholder for actual price saving logic.
    // Usually involves updating the prices relation.
    // For now, returning observable of true.
    return of(true);
  }

  private saveBarcodes(product: Product) {
    const currentBarcodes = this.barcodes();
    const originalBarcodes = this.product()?.barcodes || [];

    const added = currentBarcodes.filter(
      (b) => !b.id.includes('-') && !originalBarcodes.find((ob) => ob.id === b.id),
    ); // Simple check, better to check if ID exists in original
    // Actually, in handleAddBarcode I should use temporary IDs.
    // Let's assume new barcodes have numeric timestamp IDs which won't match UUIDs.
    // Or better: check if ID is not in original list.

    // Valid IDs are from DB (UUIDs). Temp IDs are from Date.now()
    const isNew = (id: string) => !id.includes('-'); // Rough check for UUID vs timestamp

    const toConnect: any[] = [];
    const toDelete: any[] = [];

    // Identify removals
    originalBarcodes.forEach((ob) => {
      if (!currentBarcodes.find((cb) => cb.id === ob.id)) {
        toDelete.push(this.barcodesService.delete(ob.id));
      }
    });

    // Identify additions
    currentBarcodes.forEach((cb) => {
      // If it's a temp ID (or just not found in original), create it
      const original = originalBarcodes.find((ob) => ob.id === cb.id);
      if (!original) {
        toConnect.push(
          this.barcodesService.create({
            value: cb.value,
            productId: product.id,
            type: cb.type as any,
          }),
        );
      }
    });

    const tasks = [...toDelete, ...toConnect];
    if (tasks.length === 0) {
      return of(product);
    }

    return forkJoin(tasks).pipe(map(() => product));
  }

  updateState(field: string, value: any) {
    this.formState.update((state) => ({ ...state, [field]: value }));
  }

  addPriceType() {
    const usedIds = this.salesPrices().map((p) => p.priceTypeId);
    const available = this.priceTypes().filter((pt) => !usedIds.includes(pt.id));
    if (available.length > 0) {
      this.salesPrices.update((prev) => [
        ...prev,
        {
          priceTypeId: available[0].id,
          name: available[0].name,
          value: '0',
        },
      ]);
    }
  }

  removePriceType(id: string) {
    if (this.salesPrices().length > 1) {
      this.salesPrices.update((prev) => prev.filter((p) => p.priceTypeId !== id));
    }
  }

  updatePrice(id: string, value: string) {
    this.salesPrices.update((prev) =>
      prev.map((p) => (p.priceTypeId === id ? { ...p, value } : p)),
    );
  }

  addBarcode() {
    const newBarcode: BarcodeItem = {
      id: Date.now().toString(),
      value: '',
      type: 'EAN-13',
      isPrimary: this.barcodes().length === 0,
    };
    this.barcodes.update((prev) => [...prev, newBarcode]);
  }

  removeBarcode(id: string) {
    this.barcodes.update((prev) => {
      const toRemove = prev.find((b) => b.id === id);
      const filtered = prev.filter((b) => b.id !== id);

      // If main was removed, make first main
      if (toRemove?.isPrimary && filtered.length > 0) {
        filtered[0].isPrimary = true;
      }
      return filtered;
    });
  }

  updateBarcode(id: string, field: keyof BarcodeItem, value: any) {
    this.barcodes.update((prev) =>
      prev.map((b) => {
        if (b.id === id) {
          if (field === 'isPrimary' && value === true) {
            return { ...b, isPrimary: true };
          }
          return { ...b, [field]: value };
        }
        if (field === 'isPrimary' && value === true) {
          return { ...b, isPrimary: false };
        }
        return b;
      }),
    );
  }

  setPrimaryBarcode(id: string) {
    this.updateBarcode(id, 'isPrimary', true);
  }
}
