import { CommonModule, DecimalPipe } from '@angular/common';
import { ChangeDetectionStrategy, Component, inject, input, signal } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { UiButton } from '../../../../../../core/ui/ui-button/ui-button';
import { IconName } from '../../../../../../core/ui/ui-icon/data';
import { UiIcon } from '../../../../../../core/ui/ui-icon/ui-icon.component';
import { TableColumn } from '../../../../../../core/ui/ui-table/table-column.interface';
import { UiTable } from '../../../../../../core/ui/ui-table/ui-table';

export interface Movement {
  id: string;
  date: string;
  documentType: string;
  documentNumber: string;
  type: 'in' | 'out';
  quantity: number;
  store: string;
  user: string;
}

export interface Barcode {
  id: string;
  barcode: string;
  type: string;
  isPrimary: boolean;
  createdDate: string;
}

export interface StoreQuantity {
  id: string;
  store: string;
  quantity: number;
  reservedQuantity: number;
  availableQuantity: number;
  lastUpdated: string;
}

export interface PriceHistory {
  id: string;
  date: string;
  oldPrice: number;
  newPrice: number;
  changePercent: number;
  user: string;
  reason: string;
}

const MOCK_PRODUCT = {
  id: '1',
  code: 'PROD-001',
  name: 'Laptop Dell XPS 15',
  category: 'Electronics > Computers > Laptops',
  description: 'High-performance laptop with 15.6" display, Intel Core i7, 16GB RAM, 512GB SSD',
  currentPrice: 125000,
  costPrice: 95000,
  barcode: '4820012345678',
  unit: 'pcs',
  totalStock: 47,
  reservedStock: 5,
  availableStock: 42,
  createdDate: '2025-12-15',
  lastModified: '2026-01-18',
};

const MOCK_MOVEMENTS: Movement[] = [
  {
    id: '1',
    date: '2026-01-18',
    documentType: 'Purchase Order',
    documentNumber: 'PO-2026-005',
    type: 'in',
    quantity: 10,
    store: 'Main Warehouse',
    user: 'John Doe',
  },
  {
    id: '2',
    date: '2026-01-17',
    documentType: 'Sales Order',
    documentNumber: 'SO-2026-123',
    type: 'out',
    quantity: 3,
    store: 'Main Warehouse',
    user: 'Jane Smith',
  },
  {
    id: '3',
    date: '2026-01-16',
    documentType: 'Transfer',
    documentNumber: 'TR-2026-045',
    type: 'out',
    quantity: 5,
    store: 'Main Warehouse',
    user: 'Mike Johnson',
  },
  {
    id: '4',
    date: '2026-01-16',
    documentType: 'Transfer',
    documentNumber: 'TR-2026-045',
    type: 'in',
    quantity: 5,
    store: 'Branch Store A',
    user: 'Mike Johnson',
  },
  {
    id: '5',
    date: '2026-01-15',
    documentType: 'Purchase Order',
    documentNumber: 'PO-2026-003',
    type: 'in',
    quantity: 20,
    store: 'Main Warehouse',
    user: 'Sarah Wilson',
  },
];

const MOCK_BARCODES: Barcode[] = [
  {
    id: '1',
    barcode: '4820012345678',
    type: 'EAN-13',
    isPrimary: true,
    createdDate: '2025-12-15',
  },
  {
    id: '2',
    barcode: '0123456789012',
    type: 'UPC-A',
    isPrimary: false,
    createdDate: '2025-12-20',
  },
  {
    id: '3',
    barcode: 'DELL-XPS15-2026',
    type: 'Internal',
    isPrimary: false,
    createdDate: '2026-01-05',
  },
];

const MOCK_STORE_QUANTITIES: StoreQuantity[] = [
  {
    id: '1',
    store: 'Main Warehouse',
    quantity: 25,
    reservedQuantity: 3,
    availableQuantity: 22,
    lastUpdated: '2026-01-18 14:30',
  },
  {
    id: '2',
    store: 'Branch Store A',
    quantity: 12,
    reservedQuantity: 2,
    availableQuantity: 10,
    lastUpdated: '2026-01-17 16:45',
  },
  {
    id: '3',
    store: 'Branch Store B',
    quantity: 8,
    reservedQuantity: 0,
    availableQuantity: 8,
    lastUpdated: '2026-01-16 10:20',
  },
  {
    id: '4',
    store: 'Online Store',
    quantity: 2,
    reservedQuantity: 0,
    availableQuantity: 2,
    lastUpdated: '2026-01-15 09:15',
  },
];

const MOCK_PRICE_HISTORY: PriceHistory[] = [
  {
    id: '1',
    date: '2026-01-15',
    oldPrice: 120000,
    newPrice: 125000,
    changePercent: 4.17,
    user: 'Admin',
    reason: 'Market price adjustment',
  },
  {
    id: '2',
    date: '2025-12-20',
    oldPrice: 115000,
    newPrice: 120000,
    changePercent: 4.35,
    user: 'Manager',
    reason: 'Year-end price update',
  },
  {
    id: '3',
    date: '2025-12-01',
    oldPrice: 118000,
    newPrice: 115000,
    changePercent: -2.54,
    user: 'Admin',
    reason: 'Promotional discount',
  },
  {
    id: '4',
    date: '2025-11-15',
    oldPrice: 110000,
    newPrice: 118000,
    changePercent: 7.27,
    user: 'Manager',
    reason: 'Cost increase from supplier',
  },
];

@Component({
  selector: 'app-product-detail-page',
  imports: [CommonModule, UiButton, UiIcon, UiTable, DecimalPipe],
  templateUrl: './product-detail-page.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ProductDetailPage {
  private router = inject(Router);
  private activatedRoute = inject(ActivatedRoute);

  id = input.required<string>();

  activeTab = signal('overview');

  product = signal(MOCK_PRODUCT);
  movements = signal<Movement[]>(MOCK_MOVEMENTS);
  barcodes = signal<Barcode[]>(MOCK_BARCODES);
  storeQuantities = signal<StoreQuantity[]>(MOCK_STORE_QUANTITIES);
  priceHistory = signal<PriceHistory[]>(MOCK_PRICE_HISTORY);

  tabs = [
    { id: 'overview', label: 'Обзор', icon: 'outline-box' as IconName },
    { id: 'movements', label: 'Движения', icon: 'outline-trending-up' as IconName },
    { id: 'barcodes', label: 'Штрихкоды', icon: 'outline-barcode' as IconName },
    { id: 'stores', label: 'Остатки', icon: 'outline-building-store' as IconName },
    { id: 'price-history', label: 'История цен', icon: 'outline-currency-dollar' as IconName },
  ];

  /* Columns */
  movementColumns: TableColumn<Movement>[] = [
    { key: 'date', header: 'Дата', type: 'text' }, // templated
    { key: 'documentType', header: 'Тип документа', type: 'text' },
    { key: 'documentNumber', header: 'Номер документа', type: 'text' }, // templated (mono)
    { key: 'type', header: 'Тип', type: 'text' }, // templated (badge)
    { key: 'quantity', header: 'Количество', type: 'text' }, // templated (colored)
    { key: 'store', header: 'Склад', type: 'text' },
    { key: 'user', header: 'Пользователь', type: 'text' }, // templated (icon)
  ];

  barcodeColumns: TableColumn<Barcode>[] = [
    { key: 'barcode', header: 'Штрихкод', type: 'text' }, // templated
    { key: 'type', header: 'Тип', type: 'text' }, // templated
    { key: 'createdDate', header: 'Дата создания', type: 'text' }, // templated
  ];

  storeColumns: TableColumn<StoreQuantity>[] = [
    { key: 'store', header: 'Склад', type: 'text' }, // templated
    { key: 'quantity', header: 'Общее количество', type: 'text' }, // templated (bold)
    { key: 'reservedQuantity', header: 'Зарезервировано', type: 'text' }, // templated
    { key: 'availableQuantity', header: 'Доступно', type: 'text' }, // templated
    { key: 'lastUpdated', header: 'Последнее обновление', type: 'text' },
  ];

  priceHistoryColumns: TableColumn<PriceHistory>[] = [
    { key: 'date', header: 'Дата', type: 'text' }, // templated
    { key: 'oldPrice', header: 'Старая цена', type: 'text' }, // templated
    { key: 'newPrice', header: 'Новая цена', type: 'text' }, // templated
    { key: 'changePercent', header: 'Изменение', type: 'text' }, // templated
    { key: 'user', header: 'Пользователь', type: 'text' }, // templated
    { key: 'reason', header: 'Причина', type: 'text' },
  ];

  setActiveTab(id: string) {
    this.activeTab.set(id);
  }

  navigateBack() {
    this.router.navigate(['/core/directories/nomenclature']);
  }

  editProduct() {
    void this.router.navigate(['edit'], { relativeTo: this.activatedRoute });
  }
}
