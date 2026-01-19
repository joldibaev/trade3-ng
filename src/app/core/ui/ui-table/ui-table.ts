import { Grid, GridCell, GridRow } from '@angular/aria/grid';
import { DatePipe, DecimalPipe, NgTemplateOutlet } from '@angular/common';
import {
  booleanAttribute,
  ChangeDetectionStrategy,
  Component,
  input,
  output,
  TemplateRef,
  viewChildren,
} from '@angular/core';
import { DocumentStatusComponent } from '../../../shared/components/document-status/document-status.component';
import { UiBadge, UiBadgeVariant } from '../ui-badge/ui-badge';
import { UiIcon } from '../ui-icon/ui-icon.component';
import { UiLoading } from '../ui-loading/ui-loading';
import { TableColumn, TableColumnBadge } from './table-column.interface';
import { TableValueGetterPipe } from './table-value-getter.pipe';

@Component({
  selector: 'ui-table',
  imports: [
    Grid,
    GridRow,
    GridCell,
    DatePipe,
    UiLoading,
    TableValueGetterPipe,
    UiBadge,
    UiIcon,
    DocumentStatusComponent,
    DecimalPipe,
    NgTemplateOutlet,
  ],
  templateUrl: './ui-table.html',
  styleUrl: './ui-table.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: {
    class: 'overflow-auto',
  },
})
export class UiTable<T extends object> {
  columns = input.required<TableColumn<T>[]>();
  data = input.required<T[]>();
  loading = input(false, { transform: booleanAttribute });

  gridDisabled = input(false, { transform: booleanAttribute });

  trackField = input.required<keyof T>();

  templates = input<Record<string, TemplateRef<unknown>>>();
  rowClass = input<(row: T, index: number) => string>();

  td = viewChildren(GridCell);
  selectedChanged = output<T | undefined>();

  protected onSelectedChange() {
    const active = this.td().find(({ active }) => active());
    const rowIndex = active?.rowIndex();
    this.selectedChanged.emit(rowIndex !== undefined ? this.data()[rowIndex] : undefined);
  }

  protected getBadgeVariant(
    col: TableColumn<T>,
    value: string | number | boolean | null | undefined,
  ): UiBadgeVariant {
    const badgeCol = col as TableColumnBadge<T>;
    const variant = badgeCol.badgeVariants[String(value ?? '')];
    return (variant as UiBadgeVariant) || 'primary';
  }

  protected getBadgeLabel(
    col: TableColumn<T>,
    value: string | number | boolean | null | undefined,
  ): string {
    const badgeCol = col as TableColumnBadge<T>;
    return badgeCol.badgeLabels[String(value ?? '')] || String(value ?? '');
  }
}
