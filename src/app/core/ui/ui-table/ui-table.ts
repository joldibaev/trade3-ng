import { Grid, GridCell, GridRow } from '@angular/aria/grid';
import { DatePipe } from '@angular/common';
import {
  booleanAttribute,
  ChangeDetectionStrategy,
  Component,
  input,
  model,
  output,
  viewChildren,
} from '@angular/core';
import { UiBadge, UiBadgeVariant } from '../ui-badge/ui-badge';
import { UiLoading } from '../ui-loading/ui-loading';
import { TableColumn, TableColumnBadge } from './table-column.interface';
import { TableValueGetterPipe } from './table-value-getter.pipe';

@Component({
  selector: 'ui-table',
  imports: [Grid, GridRow, GridCell, DatePipe, UiLoading, TableValueGetterPipe, UiBadge],
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

  trackField = input.required<keyof T>();

  selectedRow = model<number>();
  selectedColumn = model<number>();

  selectedItem = input<T>();

  td = viewChildren(GridCell);
  selectedChanged = output<T | undefined>();

  protected onSelectedChange() {
    const active = this.td().find(({ active }) => active());
    const rowIndex = active?.rowIndex();
    this.selectedChanged.emit(rowIndex !== undefined ? this.data()[rowIndex] : undefined);
  }

  protected getBadgeVariant(
    col: TableColumn<T>,
    value: string | number | null | undefined,
  ): UiBadgeVariant {
    const badgeCol = col as TableColumnBadge<T>;
    const variant = badgeCol.badgeVariants[String(value || '')];
    return (variant as UiBadgeVariant) || 'primary';
  }

  protected getBadgeLabel(col: TableColumn<T>, value: string | number | null | undefined): string {
    const badgeCol = col as TableColumnBadge<T>;
    return badgeCol.badgeLabels[String(value || '')] || String(value || '');
  }
}
