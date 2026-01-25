import { Dialog } from '@angular/cdk/dialog';
import {
  CdkCell,
  CdkCellDef,
  CdkColumnDef,
  CdkHeaderCell,
  CdkHeaderCellDef,
  CdkHeaderRow,
  CdkHeaderRowDef,
  CdkNoDataRow,
  CdkRow,
  CdkRowDef,
} from '@angular/cdk/table';
import { CurrencyPipe, DecimalPipe, Location } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  computed,
  DestroyRef,
  inject,
  Injector,
  input,
  OnInit,
  signal,
} from '@angular/core';
import { takeUntilDestroyed, toObservable } from '@angular/core/rxjs-interop';
import { FormsModule } from '@angular/forms';
import { form, FormField, required } from '@angular/forms/signals';
import { Router } from '@angular/router';
import { combineLatest, filter, finalize, switchMap } from 'rxjs';
import { FindPipe } from '../../../../../../core/pipes/find-pipe';
import { DocumentPurchasesService } from '../../../../../../core/services/document-purchases.service';
import { PriceTypesService } from '../../../../../../core/services/price-types.service';
import { ProductsService } from '../../../../../../core/services/products.service';
import { StoresService } from '../../../../../../core/services/stores.service';
import { VendorsService } from '../../../../../../core/services/vendors.service';
import { UiButton } from '../../../../../../core/ui/ui-button/ui-button';
import { UiCard } from '../../../../../../core/ui/ui-card/ui-card';
import { UiEmptyState } from '../../../../../../core/ui/ui-empty-state/ui-empty-state';
import { UiIcon } from '../../../../../../core/ui/ui-icon/ui-icon.component';
import { UiInput } from '../../../../../../core/ui/ui-input/ui-input';
import { UiLoading } from '../../../../../../core/ui/ui-loading/ui-loading';
import { UiNotyfService } from '../../../../../../core/ui/ui-notyf/ui-notyf.service';
import { UiSelect } from '../../../../../../core/ui/ui-select/ui-select';
import { UiTable } from '../../../../../../core/ui/ui-table/ui-table';
import { UiTitle } from '../../../../../../core/ui/ui-title/ui-title';
import { UpdateDocumentPurchaseDto } from '../../../../../../shared/interfaces/dtos/document-purchase/update-document-purchase.interface';
import { DocumentPurchaseItem } from '../../../../../../shared/interfaces/entities/document-purchase-item.interface';
import { DocumentPurchase } from '../../../../../../shared/interfaces/entities/document-purchase.interface';
import { Product } from '../../../../../../shared/interfaces/entities/product.interface';
import {
  formatDateToIso,
  getCurrentDateAsString,
} from '../../../../../../shared/utils/get-current-date-as-string';
import { ProductDetailsDialog } from './product-details-dialog/product-details-dialog';
import { ProductSelectDialog } from './product-select-dialog/product-select-dialog';

interface EditableItem {
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
  isSaved?: boolean;
}

@Component({
  selector: 'app-purchase-edit-page',
  standalone: true,
  imports: [
    FormsModule,
    FormField,
    UiTitle,
    UiCard,
    UiInput,
    UiSelect,
    UiButton,
    UiIcon,
    UiLoading,
    DecimalPipe,
    CurrencyPipe,
    UiTable,
    CdkHeaderCellDef,
    CdkHeaderCell,
    CdkCellDef,
    CdkCell,
    CdkColumnDef,
    CdkHeaderRowDef,
    CdkHeaderRow,
    CdkRowDef,
    CdkRow,
    CdkNoDataRow,
    UiEmptyState,
    FindPipe,
  ],
  templateUrl: './purchase-edit-page.html',
  styleUrl: './purchase-edit-page.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PurchaseEditPage implements OnInit {
  private purchaseService = inject(DocumentPurchasesService);
  private storeService = inject(StoresService);
  private vendorService = inject(VendorsService);
  private productService = inject(ProductsService);
  private priceTypesService = inject(PriceTypesService);
  private destroyRef = inject(DestroyRef);
  private notyf = inject(UiNotyfService);
  private router = inject(Router);
  private location = inject(Location);
  private injector = inject(Injector);
  private dialog = inject(Dialog);

  id = input.required<string>();

  // Resources
  stores = this.storeService.getAll();
  vendors = this.vendorService.getAll();
  priceTypes = this.priceTypesService.getAll();

  // State
  isLoading = signal(false);
  isSaving = signal(false);
  purchaseResource = this.purchaseService.getById(() => this.id());
  purchase = signal<DocumentPurchase | null>(null);
  items = signal<EditableItem[]>([]);

  // Form
  formState = signal({
    storeId: '',
    vendorId: '',
    date: getCurrentDateAsString(),
    notes: '',
  });

  formData = form(this.formState, (schema) => {
    required(schema.storeId, { message: 'Выберите склад' });
    required(schema.vendorId, { message: 'Выберите поставщика' });
    required(schema.date, { message: 'Выберите дату' });
  });

  totalSum = computed(() => {
    return this.items().reduce((sum, item) => sum + item.quantity * item.price, 0);
  });

  displayedColumns = computed(() => {
    const list = ['status', 'product', 'quantity', 'price', 'total'];
    if (this.priceTypes.hasValue()) {
      this.priceTypes.value()?.forEach((pt) => list.push(pt.id));
    }
    list.push('actions');
    return list;
  });

  ngOnInit() {
    this.loadData();
  }

  loadData() {
    toObservable(this.purchaseResource.isLoading, { injector: this.injector })
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe((loading) => this.isLoading.set(loading));

    combineLatest([
      toObservable(this.purchaseResource.value, { injector: this.injector }),
      toObservable(this.priceTypes.value, { injector: this.injector }),
    ])
      .pipe(
        takeUntilDestroyed(this.destroyRef),
        filter(([doc, pts]) => !!doc && !!pts),
      )
      .subscribe(([doc, pts]) => {
        if (!doc || !pts) return;

        this.purchase.set(doc);
        this.formState.set({
          storeId: doc.storeId,
          vendorId: doc.vendorId || '',
          date: doc.date.split('T')[0],
          notes: doc.notes || '',
        });

        this.items.set(
          doc.items.map((item: DocumentPurchaseItem) => ({
            tempId: crypto.randomUUID(),
            productId: item.productId,
            productName: item.product.name,
            quantity: item.quantity,
            price: item.price,
            isSaved: true,
            newPrices: pts.map((pt) => {
              const change = item.product.priceChangeItems?.find(
                (pci) => pci.priceTypeId === pt.id,
              );
              const currentPrice =
                item.product.prices?.find((p) => p.priceTypeId === pt.id)?.value || 0;

              return {
                priceTypeId: pt.id,
                name: pt.name,
                value: change ? change.newValue : 0,
                currentValue: currentPrice,
              };
            }),
          })),
        );
      });
  }

  openProductSearch() {
    this.dialog
      .open<Product>(ProductSelectDialog, { width: '500px' })
      .closed.pipe(
        takeUntilDestroyed(this.destroyRef),
        filter((product): product is Product => !!product),
        switchMap(
          (product) =>
            this.dialog.open<EditableItem>(ProductDetailsDialog, {
              width: '450px',
              data: { product, priceTypes: this.priceTypes.value() || [] },
            }).closed,
        ),
      )
      .subscribe((item) => {
        if (item) {
          if (this.items().some((i) => i.productId === item.productId)) {
            this.notyf.info('Этот товар уже есть в списке');
            return;
          }

          const extendedItem: EditableItem = {
            ...item,
            isSaved: false,
          };

          this.items.update((prev) => [...prev, extendedItem]);
        }
      });
  }

  removeItem(tempId: string) {
    this.items.update((prev) => prev.filter((i) => i.tempId !== tempId));
  }

  updateItem<K extends keyof EditableItem>(tempId: string, field: K, value: EditableItem[K]) {
    this.items.update((prev) =>
      prev.map((i) => (i.tempId === tempId ? { ...i, [field]: value } : i)),
    );
  }

  updateNewPrice(itemTempId: string, priceTypeId: string, value: number) {
    this.items.update((prev) =>
      prev.map((item) => {
        if (item.tempId === itemTempId) {
          return {
            ...item,
            newPrices: item.newPrices.map((np) =>
              np.priceTypeId === priceTypeId ? { ...np, value } : np,
            ),
          };
        }
        return item;
      }),
    );
  }

  save() {
    if (this.formData().invalid()) return;
    if (this.items().length === 0) {
      this.notyf.error('Добавьте хотя бы один товар');
      return;
    }

    this.isSaving.set(true);
    const formValue = this.formData().value();

    // ensure date has time component for formatDateToIso
    const dateStr = formValue.date.includes('T') ? formValue.date : `${formValue.date}T00:00`;

    const dto: UpdateDocumentPurchaseDto = {
      storeId: formValue.storeId,
      vendorId: formValue.vendorId,
      date: formatDateToIso(dateStr),
      notes: formValue.notes,
      items: this.items().map((item) => ({
        productId: item.productId,
        quantity: item.quantity,
        price: item.price,
        newPrices: item.newPrices
          .filter((np) => np.value > 0)
          .map((np) => ({
            priceTypeId: np.priceTypeId,
            value: np.value,
          })),
      })),
    };

    this.purchaseService
      .update(this.id(), dto)
      .pipe(
        takeUntilDestroyed(this.destroyRef),
        finalize(() => this.isSaving.set(false)),
      )
      .subscribe({
        next: () => {
          this.notyf.success('Закупка успешно обновлена');
          void this.router.navigate(['core', 'documents', 'purchases', this.id()]);
        },
        error: (err) => {
          this.notyf.error('Ошибка при сохранении');
          console.error(err);
        },
      });
  }

  cancel() {
    this.location.back();
  }
}
