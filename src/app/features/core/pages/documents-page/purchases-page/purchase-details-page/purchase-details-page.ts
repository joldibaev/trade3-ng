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
import { PurchaseItemDialog } from './purchase-item-dialog/purchase-item-dialog';

import { CreateDocumentPurchaseItemInput } from '../../../../../../shared/interfaces/dtos/document-purchase/create-document-purchase.interface';
import { UpdateDocumentPurchaseDto } from '../../../../../../shared/interfaces/dtos/document-purchase/update-document-purchase.interface';
import { getCurrentDateAsString } from '../../../../../../shared/utils/get-current-date-as-string';

type PurchaseItemViewModel = CreateDocumentPurchaseItemInput & {
  productName?: string;
  isDeleted?: boolean;
  isNew?: boolean;
};

interface PurchaseFormState extends Omit<UpdateDocumentPurchaseDto, 'items'> {
  items: PurchaseItemViewModel[];
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

  // Main Form fields
  formState = signal<PurchaseFormState>({
    date: '',
    storeId: '',
    vendorId: '',
    items: [
      {
        productId: '',
        quantity: 0,
        price: 0,
        newPrices: [],
      },
    ],
  });

  formData = form(this.formState);

  constructor() {
    // Sync form with purchase data when loaded
    effect(() => {
      const purchase = this.purchase.value();
      if (!purchase) return;

      // todo delete getCurrentDateAsString this and fix dto script
      this.formState.set({
        date: getCurrentDateAsString(purchase.date),
        storeId: purchase.storeId,
        vendorId: purchase.vendorId || '',
        items: purchase.items.map((item) => ({
          productId: item.productId,
          productName: item.product.name, // Map name from entity
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

  openItemDialog(item?: PurchaseItemViewModel, index?: number) {
    const dialogRef = this.dialog.open<{
      item: CreateDocumentPurchaseItemInput;
      productName?: string;
    }>(PurchaseItemDialog, {
      data: {
        item, // This works because ViewModel extends DTO
        productName: item?.productName,
        priceTypes: this.priceTypes.value() || [],
      },
    });

    dialogRef.closed.pipe(takeUntilDestroyed(this.destroyRef)).subscribe((result) => {
      if (!result) return;

      this.formState.update((state) => {
        const newItems = [...state.items];
        const newItem: PurchaseItemViewModel = {
          ...result.item,
          productName: result.productName || item?.productName, // Use returned name or keep existing
          isNew: index === undefined, // Mark as new if adding
        };

        if (index !== undefined) {
          newItems[index] = newItem;
        } else {
          newItems.push(newItem);
        }
        return { ...state, items: newItems };
      });
    });
  }

  removeProduct(index: number) {
    this.formState.update((state) => {
      const newItems = [...state.items];
      newItems[index] = { ...newItems[index], isDeleted: true };
      return { ...state, items: newItems };
    });
  }

  restoreProduct(index: number) {
    this.formState.update((state) => {
      const newItems = [...state.items];
      newItems[index] = { ...newItems[index], isDeleted: false };
      return { ...state, items: newItems };
    });
  }

  columns = computed<TableColumn<PurchaseItemViewModel>[]>(() => {
    const priceTypes = this.priceTypes.value() || [];

    const baseColumns: TableColumn<PurchaseItemViewModel>[] = [
      {
        key: 'productName',
        header: 'Товар',
        type: 'text',
        valueGetter: (row: PurchaseItemViewModel) => row.productName || '-',
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

    const priceColumns: TableColumn<PurchaseItemViewModel>[] = priceTypes.map((pt) => ({
      key: 'newPrices', // Using a dummy key as we use valueGetter
      header: pt.name,
      type: 'number',
      align: 'center',
      width: '150px',
      valueGetter: (row: PurchaseItemViewModel) =>
        row.newPrices?.find((np) => np.priceTypeId === pt.id)?.value || 0,
    }));

    const totalColumn: TableColumn<PurchaseItemViewModel> = {
      key: 'price', // Dummy key
      header: 'Сумма',
      align: 'center',
      type: 'number',
      width: '150px',
      valueGetter: (row: PurchaseItemViewModel) => (row.quantity || 0) * (row.price || 0),
    };

    const actionColumn: TableColumn<PurchaseItemViewModel> = {
      key: 'productId', // Dummy key
      header: '',
      type: 'template',
      templateName: 'actions',
      width: '100px',
      align: 'right',
    };

    return [...baseColumns, ...priceColumns, totalColumn, actionColumn];
  });

  rowClass = (row: PurchaseItemViewModel) => {
    if (row.isDeleted) return 'line-through opacity-50 bg-neutral-50';
    if (row.isNew) return 'bg-blue-50';
    return '';
  };

  totalQuantity = computed(() => {
    return this.formState().items.reduce((sum, item) => {
      if (item.isDeleted) return sum;
      return Number(sum) + Number(item.quantity || 0);
    }, 0);
  });

  totalAmount = computed(() => {
    return this.formState().items.reduce((sum, item) => {
      if (item.isDeleted) return sum;
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
        .items.filter((item) => !item.isDeleted)
        .map(({ productName, isDeleted, isNew, ...rest }) => rest), // Strip ViewModel props
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
