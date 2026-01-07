import { Grid, GridCell, GridRow } from '@angular/aria/grid';
import { DatePipe, DecimalPipe } from '@angular/common';
import { ChangeDetectionStrategy, Component, input, output, viewChildren } from '@angular/core';
import { ToNumberPipe } from '../../pipes/to-number-pipe';
import { ToStringPipe } from '../../pipes/to-string-pipe';
import { TableColumn } from './table-column.interface';

@Component({
  selector: 'ui-table',
  imports: [Grid, GridRow, GridCell, DatePipe, DecimalPipe, ToStringPipe, ToNumberPipe],
  templateUrl: './ui-table.html',
  styleUrl: './ui-table.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: {
    class: 'block w-full overflow-x-auto',
  },
})
export class UiTable<T extends object> {
  columns = input.required<TableColumn<T>[]>();
  data = input.required<T[]>();

  td = viewChildren('td', { read: GridCell });
  selectedChanged = output<T | undefined>();

  protected onSelectedChange() {
    const active = this.td().find(({ active }) => active());
    const index = active?.rowIndex();
    this.selectedChanged.emit(index !== undefined ? this.data()[index] : undefined);
  }
}
