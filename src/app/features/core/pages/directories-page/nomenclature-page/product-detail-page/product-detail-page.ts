import { CommonModule, Location } from '@angular/common';
import { ChangeDetectionStrategy, Component, inject, input } from '@angular/core';
import { ProductsService } from '../../../../../../core/services/products.service';
import { UiCard } from '../../../../../../core/ui/ui-card/ui-card';
import { UiLoading } from '../../../../../../core/ui/ui-loading/ui-loading';
import { UiPageHeader } from '../../../../../../core/ui/ui-page-header/ui-page-header';
import { TableColumn } from '../../../../../../core/ui/ui-table/table-column.interface';
import { UiTable } from '../../../../../../core/ui/ui-table/ui-table';
import { Price } from '../../../../../../shared/interfaces/entities/price.interface';
import { Stock } from '../../../../../../shared/interfaces/entities/stock.interface';

@Component({
  selector: 'app-product-detail-page',
  standalone: true,
  imports: [CommonModule, UiPageHeader, UiCard, UiLoading, UiTable],
  templateUrl: './product-detail-page.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ProductDetailPage {
  private productsService = inject(ProductsService);
  private location = inject(Location);

  id = input.required<string>();

  product = this.productsService.getById(this.id, ['category', 'prices', 'stocks', 'barcodes']);

  priceColumns: TableColumn<Price>[] = [
    {
      key: 'priceType',
      header: 'Тип цены',
      type: 'text',
      valueGetter: (r) => r.priceType?.name || '-',
    },
    { key: 'value', header: 'Цена', type: 'text', valueGetter: (r) => `${r.value} UZS` },
  ];

  stockColumns: TableColumn<Stock>[] = [
    { key: 'store', header: 'Магазин', type: 'text', valueGetter: (r) => r.store?.name || '-' },
    { key: 'quantity', header: 'Количество', type: 'text' },
  ];

  back() {
    this.location.back();
  }
}
