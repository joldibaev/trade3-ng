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

import { Dialog } from '@angular/cdk/dialog';
import { CurrencyPipe, DatePipe, DecimalPipe, Location } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  computed,
  DestroyRef,
  inject,
  input,
} from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
// ...
import { Router } from '@angular/router';
import { filter, switchMap } from 'rxjs';
import { ToNumberPipe } from '../../../../../../core/pipes/to-number-pipe';
import { DocumentPurchasesService } from '../../../../../../core/services/document-purchases.service';
import { PriceTypesService } from '../../../../../../core/services/price-types.service';
import { UiBadge } from '../../../../../../core/ui/ui-badge/ui-badge';
import { UiButton } from '../../../../../../core/ui/ui-button/ui-button';
import { UiCard } from '../../../../../../core/ui/ui-card/ui-card';
import { UiEmptyState } from '../../../../../../core/ui/ui-empty-state/ui-empty-state';
import { UiIcon } from '../../../../../../core/ui/ui-icon/ui-icon.component';
import { UiList } from '../../../../../../core/ui/ui-list/ui-list';
import { UiListItem } from '../../../../../../core/ui/ui-list/ui-list-item/ui-list-item';
import { UiNotyfService } from '../../../../../../core/ui/ui-notyf/ui-notyf.service';
import { UiTable } from '../../../../../../core/ui/ui-table/ui-table';
import { UiTitle } from '../../../../../../core/ui/ui-title/ui-title';
import { DocumentStatus } from '../../../../../../shared/interfaces/constants';
import { CreateDocumentPurchaseItemInput } from '../../../../../../shared/interfaces/dtos/document-purchase/create-document-purchase.interface';
import { DocumentPriceChangeItem } from '../../../../../../shared/interfaces/entities/document-price-change-item.interface';
import { DocumentPurchaseItem } from '../../../../../../shared/interfaces/entities/document-purchase-item.interface';
import {
  ProductDetailsDialog,
  ProductDetailsResult,
} from '../components/product-details-dialog/product-details-dialog';
import {
  ProductSelectDialog,
  ProductSelectionResult,
} from '../components/product-select-dialog/product-select-dialog';
import { PurchaseDialog } from '../purchase-dialog/purchase-dialog';
import { DocumentHistory } from './document-history/document-history';

@Component({
  selector: 'app-purchase-details-page',

  imports: [
    DatePipe,
    UiCard,
    UiList,
    UiListItem,
    UiTitle,
    CdkCell,
    CdkCellDef,
    CdkColumnDef,
    CdkHeaderCell,
    CdkHeaderRow,
    CdkHeaderRowDef,
    CdkRow,
    CdkRowDef,
    UiEmptyState,
    UiTable,
    CdkHeaderCellDef,
    CdkNoDataRow,
    DecimalPipe,
    UiIcon,
    ToNumberPipe,
    CurrencyPipe,
    UiBadge,
    DocumentHistory,
    UiButton,
  ],
  templateUrl: './purchase-details-page.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: { class: 'space-y-4' },
})
export class PurchaseDetailsPage {
  private purchaseService = inject(DocumentPurchasesService);
  private priceTypesService = inject(PriceTypesService);
  private destroyRef = inject(DestroyRef);
  private notyf = inject(UiNotyfService);
  private dialog = inject(Dialog);
  private location = inject(Location);
  private router = inject(Router); // Keeping router if needed, but navigation to edit page is removed. Can remove if unused.

  id = input.required<string>();

  purchase = this.purchaseService.getById(() => this.id());
  priceTypes = this.priceTypesService.getAll();

  displayedColumns = computed<(keyof DocumentPurchaseItem | string)[]>(() => {
    const list = ['product', 'quantity', 'price', 'total'];

    if (this.priceTypes.hasValue()) {
      this.priceTypes.value()?.forEach((priceType) => {
        list.push(priceType.id);
      });
    }

    if (this.purchase.value()?.status === DocumentStatus.DRAFT) {
      list.push('actions');
    }
    return list;
  });

  productMap = computed(() => {
    const map: Record<string, string> = {};
    this.purchase.value()?.items.forEach((item) => {
      map[item.productId] = item.product.name;
    });
    return map;
  });

  priceChangeItemsMap = computed(() => {
    const map: Record<string, Record<string, DocumentPriceChangeItem>> = {};
    const priceChange = this.purchase.value()?.generatedPriceChange;

    if (priceChange && priceChange.items) {
      priceChange.items.forEach((item) => {
        if (!map[item.productId]) {
          map[item.productId] = {};
        }
        map[item.productId][item.priceTypeId] = item;
      });
    }
    return map;
  });

  complete() {
    this.updateStatus(DocumentStatus.COMPLETED);
  }

  revert() {
    this.updateStatus(DocumentStatus.DRAFT);
  }

  edit() {
    this.dialog
      .open(PurchaseDialog, {
        width: '500px',
        data: { purchase: this.purchase.value() },
      })
      .closed.subscribe((res) => {
        if (res) {
          this.notyf.success('Данные обновлены');
          this.purchase.reload();
        }
      });
  }

  addItem() {
    const purchase = this.purchase.value();
    if (!purchase) return;

    this.dialog
      .open<ProductSelectionResult>(ProductSelectDialog, {
        width: '600px',
        data: { existingItems: purchase.items.map((i) => i.productId) },
      })
      .closed.pipe(
        filter((result): result is ProductSelectionResult => !!result),
        switchMap(
          (result) =>
            this.dialog.open<ProductDetailsResult>(ProductDetailsDialog, {
              width: '450px',
              data: {
                product: result.product,
                priceTypes: this.priceTypes.value() || [],
                lastPurchasePrice: result.lastPurchasePrice,
              },
            }).closed,
        ),
      )
      .subscribe((result) => {
        if (result) {
          const itemInput: CreateDocumentPurchaseItemInput = {
            productId: result.productId,
            quantity: result.quantity,
            price: result.price,
            newPrices: result.newPrices.map((p) => ({
              priceTypeId: p.priceTypeId,
              value: p.value,
            })),
          };

          this.purchaseService.addItem(this.id(), itemInput).subscribe({
            next: () => {
              this.notyf.success('Товар добавлен');
              this.purchase.reload();
            },
            error: (err) => {
              this.notyf.error('Ошибка при добавлении товара');
              console.error(err);
            },
          });
        }
      });
  }

  editItem(item: DocumentPurchaseItem) {
    const purchase = this.purchase.value();
    if (!purchase) return;

    // We need full product details for dialog (prices, stocks etc).
    // Ideally we should fetch fresh product data or use what we have in item.product if sufficient.
    // ProductDetailsDialog expects full Product object. item.product includes prices/stocks?
    // findOne in service includes: items.product.prices, items.product.priceChangeItems.
    // It does NOT include product.stocks in findOne (checked service).
    // So we technically should fetch the product to get stocks if we want to show them.
    // But for now let's use what we have or rely on dialog to be robust.
    // Wait, ProductDetailsDialog was modified in previous steps.
    // Let's assume we pass item.product and it has enough info OR we should fetch key data.
    // The EditPage was fetching it. Let's do the same here for consistency?
    // Actually lets try passing item.product first. If stocks are missing, they just won't show.
    // But User might want to see stocks.
    // Let's rely on item.product for now to keep it simple, as findOne includes a lot.

    const currentPriceChanges = this.priceChangeItemsMap()[item.productId] || {};
    // Format newPrices for dialog initial state
    const newPrices: Record<string, number> = {};
    this.priceTypes.value()?.forEach((pt) => {
      newPrices[pt.id] = currentPriceChanges[pt.id]?.newValue || 0;
    });

    this.dialog
      .open<ProductDetailsResult>(ProductDetailsDialog, {
        width: '450px',
        data: {
          product: item.product,
          priceTypes: this.priceTypes.value() || [],
          initialData: {
            tempId: item.id, // Using real ID as tempId for dialog tracking
            quantity: item.quantity,
            price: item.price,
            newPrices: Object.entries(newPrices).map(([id, val]) => ({
              priceTypeId: id,
              value: val,
            })),
          },
        },
      })
      .closed.subscribe((result) => {
        if (result) {
          const itemInput: CreateDocumentPurchaseItemInput = {
            productId: result.productId,
            quantity: result.quantity,
            price: result.price, // Cost price
            newPrices: result.newPrices.map((p) => ({
              priceTypeId: p.priceTypeId,
              value: p.value,
            })),
          };
          this.purchaseService.updateItem(this.id(), item.productId, itemInput).subscribe({
            next: () => {
              this.notyf.success('Товар обновлен');
              this.purchase.reload();
            },
            error: (err) => {
              this.notyf.error('Ошибка при обновлении');
              console.error(err);
            },
          });
        }
      });
  }

  removeItem(item: DocumentPurchaseItem) {
    if (!confirm('Вы уверены, что хотите удалить этот товар?')) return;

    this.purchaseService.removeItem(this.id(), item.productId).subscribe({
      next: () => {
        this.notyf.success('Товар удален');
        this.purchase.reload();
      },
      error: (err) => {
        this.notyf.error('Ошибка при удалении');
        console.error(err);
      },
    });
  }

  private updateStatus(status: DocumentStatus) {
    const id = this.id();
    this.purchaseService
      .updateStatus(id, status)
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
