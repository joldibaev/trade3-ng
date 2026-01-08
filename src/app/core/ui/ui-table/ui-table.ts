import { Grid, GridCell, GridRow } from '@angular/aria/grid';
import { DatePipe, DecimalPipe } from '@angular/common';
import {
  booleanAttribute,
  ChangeDetectionStrategy,
  Component,
  input,
  output,
  viewChildren,
} from '@angular/core';
import { ToNumberPipe } from '../../pipes/to-number-pipe';
import { ToStringPipe } from '../../pipes/to-string-pipe';
import { UiLoading } from '../ui-loading/ui-loading';
import { TableColumn } from './table-column.interface';
import { TableValueGetterPipe } from './table-value-getter.pipe';

@Component({
  selector: 'ui-table',
  imports: [
    Grid,
    GridRow,
    GridCell,
    DatePipe,
    DecimalPipe,
    ToStringPipe,
    ToNumberPipe,
    UiLoading,
    TableValueGetterPipe,
  ],
  templateUrl: './ui-table.html',
  styleUrl: './ui-table.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: {
    class: 'flex flex-col flex-1 w-full h-full overflow-auto bg-white',
  },
})
export class UiTable<T extends object> {
  columns = input.required<TableColumn<T>[]>();
  data = input.required<T[]>();
  loading = input(false, { transform: booleanAttribute });

  td = viewChildren(GridCell);
  selectedChanged = output<T | undefined>();

  protected onSelectedChange() {
    const active = this.td().find(({ active }) => active());
    const index = active?.rowIndex();
    this.selectedChanged.emit(index !== undefined ? this.data()[index] : undefined);
  }
}
