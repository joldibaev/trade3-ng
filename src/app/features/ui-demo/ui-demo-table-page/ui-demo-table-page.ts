import { ChangeDetectionStrategy, Component } from '@angular/core';
import { TableColumn } from '../../../core/ui/ui-table/table-column.interface';
import { UiTable } from '../../../core/ui/ui-table/ui-table';

@Component({
  selector: 'app-ui-demo-table-page',
  imports: [UiTable],
  templateUrl: './ui-demo-table-page.html',
  styleUrl: './ui-demo-table-page.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: { class: 'flex flex-col gap-4' },
})
export class UiDemoTablePage {
  columns: TableColumn[] = [
    { key: 'id', header: '№' },
    { key: 'name', header: 'Товар' },
    { key: 'quantity', header: 'Кол-во' },
    { key: 'price', header: 'Цена' },
    { key: 'sum', header: 'Сумма' },
  ];

  data = [
    { id: 1, name: 'Ноутбук Lenovo IdeaPad', quantity: 1, price: '45 000', sum: '45 000' },
    { id: 2, name: 'Мышь Logitech G102', quantity: 2, price: '2 500', sum: '5 000' },
    { id: 3, name: 'Клавиатура Keychron K2', quantity: 1, price: '12 000', sum: '12 000' },
    { id: 4, name: 'Монитор Dell P2419H', quantity: 2, price: '18 000', sum: '36 000' },
    { id: 5, name: 'Кабель HDMI 2.0', quantity: 5, price: '800', sum: '4 000' },
  ];
}
