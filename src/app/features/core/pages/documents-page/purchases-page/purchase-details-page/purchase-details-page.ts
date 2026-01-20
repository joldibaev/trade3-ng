import { Dialog, DialogModule } from '@angular/cdk/dialog';
import { DecimalPipe } from '@angular/common'; // keep imports
import {
  ChangeDetectionStrategy,
  Component,
  computed,
  DestroyRef,
  effect,
  inject,
  input,
  signal,
} from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { FormsModule } from '@angular/forms';
import { form, FormField, readonly, required } from '@angular/forms/signals';
import { filter } from 'rxjs';
import { DocumentPurchasesService } from '../../../../../../core/services/document-purchases.service';
import { PriceTypesService } from '../../../../../../core/services/price-types.service';
import { StoresService } from '../../../../../../core/services/stores.service';
import { VendorsService } from '../../../../../../core/services/vendors.service';
import { UiBreadcrumb } from '../../../../../../core/ui/ui-breadcrumb/ui-breadcrumb';
import { UiButton } from '../../../../../../core/ui/ui-button/ui-button';
import { UiCard } from '../../../../../../core/ui/ui-card/ui-card';
import { UiIcon } from '../../../../../../core/ui/ui-icon/ui-icon.component';
import { UiInput } from '../../../../../../core/ui/ui-input/ui-input';
import { UiLoading } from '../../../../../../core/ui/ui-loading/ui-loading';
import { UiNotyfService } from '../../../../../../core/ui/ui-notyf/ui-notyf.service';
import { UiPageHeader } from '../../../../../../core/ui/ui-page-header/ui-page-header';
import { UiSelect } from '../../../../../../core/ui/ui-select/ui-select';
import { DocumentHistoryComponent } from '../../../../../../shared/components/document-history/document-history.component';
import { DocumentStatusComponent } from '../../../../../../shared/components/document-status/document-status.component';
import { DocumentStatus } from '../../../../../../shared/interfaces/constants';
import { CreateDocumentPurchaseItemInput } from '../../../../../../shared/interfaces/dtos/document-purchase/create-document-purchase.interface';
import { UpdateDocumentPurchaseDto } from '../../../../../../shared/interfaces/dtos/document-purchase/update-document-purchase.interface';
import { getCurrentDateAsString } from '../../../../../../shared/utils/get-current-date-as-string';
import { PurchaseItemCardComponent } from './components/purchase-item-card/purchase-item-card.component';
import { ProductSelectDialog } from './product-select-dialog/product-select-dialog';
import { PurchaseItemDialog } from './purchase-item-dialog/purchase-item-dialog';

interface PurchaseFormState {
  date: string;
  storeId: string;
  vendorId: string;
  items: (CreateDocumentPurchaseItemInput & { productName?: string })[];
  notes: string;
  code: string;
}

@Component({
  selector: 'app-purchase-details-page',
  standalone: true,
  imports: [
    DialogModule,
    UiCard,
    UiButton,
    UiLoading,
    UiBreadcrumb,
    FormsModule,
    UiPageHeader,
    DocumentStatusComponent,
    UiIcon,
    UiSelect,
    UiInput,
    FormField,
    DocumentHistoryComponent,
    PurchaseItemCardComponent,
    DecimalPipe,
  ],
  templateUrl: './purchase-details-page.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: { class: 'flex flex-col gap-4' },
})
export class PurchaseDetailsPage {
  protected readonly DocumentStatus = DocumentStatus;
  private purchasesService = inject(DocumentPurchasesService);
  private priceTypesService = inject(PriceTypesService);
  private storesService = inject(StoresService);
  private vendorsService = inject(VendorsService);
  private notyf = inject(UiNotyfService);
  private destroyRef = inject(DestroyRef);
  private dialog = inject(Dialog);

  // Inputs from route
  id = input.required<string>();

  // Resources
  purchase = this.purchasesService.getById(() => this.id());
  priceTypes = this.priceTypesService.getAll();
  stores = this.storesService.getAll();
  vendors = this.vendorsService.getAll();

  // State for tracking UI status
  deletedIndices = signal<Set<number>>(new Set());
  newIndices = signal<Set<number>>(new Set());

  // Main Form fields
  formState = signal<PurchaseFormState>({
    date: getCurrentDateAsString(),
    storeId: '',
    vendorId: '',
    items: [],
    notes: '',
    code: '',
  });

  formData = form(this.formState, (p) => {
    readonly(p.code);
    required(p.date, { message: 'Дата заказа обязательна' });
    required(p.storeId, { message: 'Склад обязателен' });
    required(p.vendorId, { message: 'Поставщик обязателен' });
  });

  constructor() {
    // Sync form with purchase data when loaded
    effect(() => {
      const purchase = this.purchase.value();
      if (!purchase) return;

      // Reset UI state on reload
      this.deletedIndices.set(new Set());
      this.newIndices.set(new Set());

      // todo delete getCurrentDateAsString this and fix dto script
      this.formState.set({
        code: (purchase.code || '').toString(),
        date: getCurrentDateAsString(purchase.date),
        storeId: purchase.storeId,
        vendorId: purchase.vendorId || '',
        items: purchase.items.map((item) => ({
          productId: item.productId,
          productName: item.product.name,
          quantity: item.quantity,
          price: item.price,
          newPrices:
            item.newPrices?.map((np) => ({
              priceTypeId: np.priceTypeId,
              value: np.value,
            })) || [],
        })),
        notes: purchase.notes || '',
      });
    });
    effect(() => {
      console.log('Product Map Computed:', this.productMap());
    });
  }

  breadcrumbItems = computed(() => {
    const code = this.purchase.value()?.code;

    return [
      { label: 'Главная', url: '/core/dashboard' },
      { label: 'Документы' },
      { label: 'Закупки', url: '/core/documents/purchases' },
      { label: code ? `Закупка №${code}` : 'Закупка' },
    ];
  });

  productMap = computed(() => {
    const purchase = this.purchase.value();
    if (!purchase?.items) return {};
    return purchase.items.reduce(
      (acc, item) => {
        acc[item.productId] = item.product.name;
        return acc;
      },
      {} as Record<string, string>,
    );
  });

  openItemDialog(
    item?: CreateDocumentPurchaseItemInput & { productName?: string },
    index?: number,
  ) {
    if (item) {
      this.openItemDetailsDialog(item, index);
      return;
    }

    const selectDialogRef = this.dialog.open<{ productId: string; productName: string }>(
      ProductSelectDialog,
      { width: '400px' },
    );

    selectDialogRef.closed
      .pipe(filter(Boolean), takeUntilDestroyed(this.destroyRef))
      .subscribe((result) => {
        const newItem: Partial<CreateDocumentPurchaseItemInput> = {
          productId: result.productId,
          quantity: 1,
          price: 0,
        };
        const viewModel = {
          ...newItem,
          productName: result.productName,
        };

        this.openItemDetailsDialog(
          viewModel as CreateDocumentPurchaseItemInput & { productName?: string },
          undefined,
        );
      });
  }

  private openItemDetailsDialog(
    item: CreateDocumentPurchaseItemInput & { productName?: string },
    index?: number,
  ) {
    const dialogRef = this.dialog.open<{
      item: CreateDocumentPurchaseItemInput;
      productName?: string;
    }>(PurchaseItemDialog, {
      data: {
        item,
        productName: item?.productName,
        priceTypes: this.priceTypes.value() || [],
      },
    });

    dialogRef.closed.pipe(takeUntilDestroyed(this.destroyRef)).subscribe((result) => {
      if (!result) return;

      this.formState.update((state) => {
        const newItems = [...state.items];
        const newItem = {
          ...result.item,
          productName: result.productName || item?.productName,
        };

        if (index !== undefined) {
          newItems[index] = newItem;
        } else {
          newItems.push(newItem);
          this.newIndices.update((set) => new Set(set).add(newItems.length - 1));
        }
        return { ...state, items: newItems };
      });
    });
  }

  removeProduct(index: number) {
    this.deletedIndices.update((set) => new Set(set).add(index));
  }

  restoreProduct(index: number) {
    this.deletedIndices.update((set) => {
      const newSet = new Set(set);
      newSet.delete(index);
      return newSet;
    });
  }

  // Removed rowClass helper (handled in template)
  // Removed columns computed

  totalPositions = computed(() => {
    return this.formState().items.filter((_, index) => !this.deletedIndices().has(index)).length;
  });

  totalQuantity = computed(() => {
    return this.formState().items.reduce((sum, item, index) => {
      if (this.deletedIndices().has(index)) return sum;
      return Number(sum) + Number(item.quantity || 0);
    }, 0);
  });

  totalAmount = computed(() => {
    return this.formState().items.reduce((sum, item, index) => {
      if (this.deletedIndices().has(index)) return sum;
      return sum + (item.quantity || 0) * (item.price || 0);
    }, 0);
  });

  save() {
    // Validate main form
    if (this.formData().invalid()) {
      this.notyf.error('Пожалуйста, исправьте ошибки в форме');
      return;
    }

    if (this.purchase.isLoading()) return;

    const { code, ...rest } = this.formState();

    const dto: UpdateDocumentPurchaseDto = {
      ...rest,
      status: this.purchase.value()?.status,
      items: rest.items
        .filter((_, index) => !this.deletedIndices().has(index))
        .map((item) => {
          const { productId, quantity, price, newPrices } = item;
          return { productId, quantity, price, newPrices };
        }),
    };

    this.purchasesService
      .update(this.id(), dto)
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: () => {
          this.notyf.success('Закупка успешно обновлена');
          this.purchase.reload();
        },
        error: (err) => {
          this.notyf.error('Ошибка при сохранении закупки');
          console.error(err);
        },
      });
  }

  updateStatus(status: DocumentStatus) {
    this.purchasesService
      .updateStatus(this.id(), status)
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: () => {
          this.notyf.success('Статус документа обновлен');
          this.purchase.reload();
        },
        error: (err) => {
          this.notyf.error('Ошибка при обновлении статуса');
          console.error(err);
        },
      });
  }
}
