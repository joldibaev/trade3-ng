import { CurrencyPipe, DatePipe, Location } from '@angular/common';
import { ChangeDetectionStrategy, Component, computed, inject, input } from '@angular/core';
import { DocumentPurchasesService } from '../../../../../../core/services/document-purchases.service';
import { UiBreadcrumb } from '../../../../../../core/ui/ui-breadcrumb/ui-breadcrumb';
import { UiButton } from '../../../../../../core/ui/ui-button/ui-button';
import { UiCard } from '../../../../../../core/ui/ui-card/ui-card';
import { UiLoading } from '../../../../../../core/ui/ui-loading/ui-loading';
import { TableColumn } from '../../../../../../core/ui/ui-table/table-column.interface';
import { UiTable } from '../../../../../../core/ui/ui-table/ui-table';
import { DocumentPurchaseItem } from '../../../../../../shared/interfaces/entities/document-purchase-item.interface';

@Component({
  selector: 'app-purchase-details-page',
  standalone: true,
  imports: [UiCard, UiButton, UiLoading, DatePipe, CurrencyPipe, UiBreadcrumb, UiTable],
  templateUrl: './purchase-details-page.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: { class: 'flex flex-col gap-4' },
})
export class PurchaseDetailsPage {
  private purchasesService = inject(DocumentPurchasesService);
  private location = inject(Location);

  // Inputs from route
  id = input.required<string>();

  // Resources
  purchase = this.purchasesService.getById(() => this.id());

  breadcrumbItems = computed(() => {
    const code = this.purchase.value()?.code;

    return [
      { label: 'Главная', url: '/core/dashboard' },
      { label: 'Документы' },
      { label: 'Закупки', url: '/core/documents/purchases' },
      { label: code ? `Закупка №${code}` : 'Закупка' },
    ];
  });

  totalQuantity = computed(() => {
    return (
      this.purchase
        .value()
        ?.items?.reduce((sum: number, item: DocumentPurchaseItem) => sum + item.quantity, 0) || 0
    );
  });

  totalAmount = computed(() => {
    return (
      this.purchase
        .value()
        ?.items?.reduce((sum: number, item: DocumentPurchaseItem) => sum + item.total, 0) || 0
    );
  });

  itemColumns: TableColumn<DocumentPurchaseItem>[] = [
    {
      key: 'product',
      header: 'Товар',
      width: '40%',
      type: 'text',
      valueGetter: (item) => item.product.name,
    },
    {
      key: 'quantity',
      header: 'Кол-во',
      type: 'number',
    },
    {
      key: 'price',
      header: 'Цена',
      type: 'number',
    },
    {
      key: 'total',
      header: 'Сумма',
      type: 'number',
    },
  ];

  back() {
    this.location.back();
  }
}
