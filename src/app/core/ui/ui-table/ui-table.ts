import { Grid, GridCell, GridRow } from '@angular/aria/grid';
import { ChangeDetectionStrategy, Component, input } from '@angular/core';
import { TableColumn } from './table-column.interface';

@Component({
  selector: 'ui-table',
  imports: [Grid, GridRow, GridCell],
  templateUrl: './ui-table.html',
  styleUrl: './ui-table.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: {
    class: 'block w-full overflow-x-auto',
  },
})
export class UiTable {
  columns = input.required<TableColumn[]>();
  data = input.required<Record<string, unknown>[]>();
}
