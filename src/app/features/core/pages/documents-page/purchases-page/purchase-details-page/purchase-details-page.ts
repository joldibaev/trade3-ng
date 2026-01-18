import { Dialog, DialogModule } from '@angular/cdk/dialog';
import { CurrencyPipe, DatePipe, Location } from '@angular/common';
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
import { form } from '@angular/forms/signals';
import { filter } from 'rxjs';
import { DocumentPurchasesService } from '../../../../../../core/services/document-purchases.service';
import { PriceTypesService } from '../../../../../../core/services/price-types.service';
import { UiBreadcrumb } from '../../../../../../core/ui/ui-breadcrumb/ui-breadcrumb';
import { UiButton } from '../../../../../../core/ui/ui-button/ui-button';
import { UiCard } from '../../../../../../core/ui/ui-card/ui-card';
import { UiLoading } from '../../../../../../core/ui/ui-loading/ui-loading';
import { UiNotyfService } from '../../../../../../core/ui/ui-notyf/ui-notyf.service';
import { UiPageHeader } from '../../../../../../core/ui/ui-page-header/ui-page-header';
import { TableColumn } from '../../../../../../core/ui/ui-table/table-column.interface';
import { UiTable } from '../../../../../../core/ui/ui-table/ui-table';
import { DocumentStatusComponent } from '../../../../../../shared/components/document-status/document-status.component';
import { ProductSelectDialog } from './product-select-dialog/product-select-dialog';
import { PurchaseItemDialog } from './purchase-item-dialog/purchase-item-dialog';

import { UiIcon } from '../../../../../../core/ui/ui-icon/ui-icon.component';
import { CreateDocumentPurchaseItemInput } from '../../../../../../shared/interfaces/dtos/document-purchase/create-document-purchase.interface';
import { UpdateDocumentPurchaseDto } from '../../../../../../shared/interfaces/dtos/document-purchase/update-document-purchase.interface';
import { getCurrentDateAsString } from '../../../../../../shared/utils/get-current-date-as-string';

interface PurchaseFormState extends Omit<UpdateDocumentPurchaseDto, 'items'> {
  items: (CreateDocumentPurchaseItemInput & { productName?: string })[];
}

@Component({
  selector: 'app-purchase-details-page',
  standalone: true,
  imports: [
    DialogModule,
    UiCard,
    UiButton,
    UiLoading,
    DatePipe,
    CurrencyPipe,
    UiBreadcrumb,
    FormsModule,
    UiTable,
    UiPageHeader,
    DocumentStatusComponent,
    UiIcon,
  ],
  templateUrl: './purchase-details-page.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: { class: 'flex flex-col gap-4' },
})
export class PurchaseDetailsPage {
  private purchasesService = inject(DocumentPurchasesService);
  private priceTypesService = inject(PriceTypesService);
  private notyf = inject(UiNotyfService);
  private location = inject(Location);
  private destroyRef = inject(DestroyRef);
  private dialog = inject(Dialog);

  // Inputs from route
  id = input.required<string>();

  // Resources
  purchase = this.purchasesService.getById(() => this.id());
  priceTypes = this.priceTypesService.getAll();

  // State for tracking UI status
  deletedIndices = signal<Set<number>>(new Set());
  newIndices = signal<Set<number>>(new Set());

  // Main Form fields
  formState = signal<PurchaseFormState>({
    date: '',
    storeId: '',
    vendorId: '',
    items: [],
  });

  formData = form(this.formState);

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
      });
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

  rowClass = (row: unknown, index: number) => {
    return this.deletedIndices().has(index) ? 'bg-red-50 text-slate-500' : '';
  };

  columns = computed<TableColumn<CreateDocumentPurchaseItemInput & { productName?: string }>[]>(
    () => {
      const priceTypes = this.priceTypes.value() || [];

      const baseColumns: TableColumn<CreateDocumentPurchaseItemInput & { productName?: string }>[] =
        [
          {
            key: 'productId', // Dummy key for template
            header: '',
            type: 'template',
            templateName: 'status',
            width: '40px',
            align: 'center',
          },
          {
            key: 'productName',
            header: 'Товар',
            type: 'text',
            valueGetter: (row) => row.productName || '-',
          },
          {
            key: 'quantity',
            header: 'Кол-во',
            type: 'number',
            align: 'center',
            width: '100px',
          },
          {
            key: 'price',
            header: 'Цена (Закуп)',
            align: 'center',
            type: 'number',
            width: '150px',
          },
        ];

      const priceColumns: TableColumn<
        CreateDocumentPurchaseItemInput & { productName?: string }
      >[] = priceTypes.map((pt) => ({
        key: 'newPrices',
        header: pt.name,
        type: 'number',
        align: 'center',
        width: '150px',
        valueGetter: (row) => row.newPrices?.find((np) => np.priceTypeId === pt.id)?.value || 0,
      }));

      const totalColumn: TableColumn<CreateDocumentPurchaseItemInput & { productName?: string }> = {
        key: 'price',
        header: 'Сумма',
        align: 'center',
        type: 'number',
        width: '150px',
        valueGetter: (row) => (row.quantity || 0) * (row.price || 0),
      };

      const actionColumn: TableColumn<CreateDocumentPurchaseItemInput & { productName?: string }> =
        {
          key: 'productId',
          header: '',
          type: 'template',
          templateName: 'actions',
          width: '100px',
          align: 'right',
        };

      return [...baseColumns, ...priceColumns, totalColumn, actionColumn];
    },
  );

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

    const dto: UpdateDocumentPurchaseDto = {
      ...this.formState(),
      items: this.formState()
        .items.filter((_, index) => !this.deletedIndices().has(index))
        .map(({ productName, ...rest }) => rest),
    };

    this.purchasesService
      .update(this.id(), dto)
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: () => {
          this.notyf.success('Закупка успешно обновлена');
          this.purchase.reload();
        },
        error: () => {},
      });
  }

  back() {
    this.location.back();
  }
}
