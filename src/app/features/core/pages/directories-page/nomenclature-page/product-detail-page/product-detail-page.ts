import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, inject, input } from '@angular/core';
import { PriceHistoriesService } from '../../../../../../core/services/price-histories.service';
import { PriceTypesService } from '../../../../../../core/services/price-types.service';
import { ProductsService } from '../../../../../../core/services/products.service';
import { StockMovementsService } from '../../../../../../core/services/stock-movements.service';
import { StoresService } from '../../../../../../core/services/stores.service';
import { UiLoading } from '../../../../../../core/ui/ui-loading/ui-loading';
import { UiPageHeader } from '../../../../../../core/ui/ui-page-header/ui-page-header';
import { UiTab } from '../../../../../../core/ui/ui-tab/ui-tab';
import { UiTabGroup } from '../../../../../../core/ui/ui-tab/ui-tab-group';
import { TableColumn } from '../../../../../../core/ui/ui-table/table-column.interface';
import { UiTable } from '../../../../../../core/ui/ui-table/ui-table';
import { PriceHistory } from '../../../../../../shared/interfaces/entities/price-history.interface';
import { StockMovement } from '../../../../../../shared/interfaces/entities/stock-movement.interface';

@Component({
  selector: 'app-product-detail-page',
  imports: [CommonModule, UiPageHeader, UiLoading, UiTable, UiTabGroup, UiTab],
  templateUrl: './product-detail-page.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ProductDetailPage {
  private productsService = inject(ProductsService);
  private storesService = inject(StoresService);
  private priceTypesService = inject(PriceTypesService);
  private priceHistoriesService = inject(PriceHistoriesService);
  private stockMovementsService = inject(StockMovementsService);

  stores = this.storesService.getAll();
  priceTypes = this.priceTypesService.getAll();

  id = input.required<string>();

  product = this.productsService.getById(this.id, ['category', 'prices', 'stocks', 'barcodes']);

  priceHistory = this.priceHistoriesService.getAll({
    params: () => ({ productId: this.id(), include: 'priceType,product' }),
  });

  stockMovements = this.stockMovementsService.getAll({
    params: () => ({ productId: this.id(), include: 'store,product' }),
  });

  getPriceTypeName(priceTypeId: string) {
    const type = this.priceTypes.value()?.find((t) => t.id === priceTypeId);
    return type?.name || '-';
  }

  getStoreName(storeId: string) {
    const store = this.stores.value()?.find((s) => s.id === storeId);
    return store?.name || '-';
  }

  priceHistoryColumns: TableColumn<PriceHistory>[] = [
    {
      key: 'date',
      header: 'Дата',
      type: 'date',
      valueGetter: (r) => r.createdAt,
    },
    {
      key: 'priceType',
      header: 'Тип цены',
      type: 'text',
      valueGetter: (r) => r.priceType?.name || this.getPriceTypeName(r.priceTypeId),
    },
    {
      key: 'value',
      header: 'Цена',
      type: 'text',
      valueGetter: (r) => `${r.value} UZS`,
    },
  ];

  stockMovementColumns: TableColumn<StockMovement>[] = [
    {
      key: 'date',
      header: 'Дата',
      type: 'date',
      valueGetter: (r) => r.createdAt,
    },
    {
      key: 'type',
      header: 'Тип',
      type: 'text',
    },
    {
      key: 'store',
      header: 'Склад',
      type: 'text',
      valueGetter: (r) => r.store?.name || this.getStoreName(r.storeId),
    },
    {
      key: 'quantity',
      header: 'Кол-во',
      type: 'text',
      valueGetter: (r) => `${r.quantity > 0 ? '+' : ''}${r.quantity}`,
    },
    {
      key: 'quantityAfter',
      header: 'Остаток',
      type: 'text',
      valueGetter: (r) => r.quantityAfter || '-',
    },
  ];
}
