export interface TableColumnBase<T> {
  key: keyof T;
  header: string;
  editable?: boolean;
  width?: string;
  valueGetter?: (row: T, index: number) => string | number | null | undefined;
}

export interface TableColumnText<T> extends TableColumnBase<T> {
  type: 'text';
}

export interface TableColumnNumber<T> extends TableColumnBase<T> {
  type: 'number';
}

export interface TableColumnDate<T> extends TableColumnBase<T> {
  type: 'date';
}

export interface TableColumnBadge<T> extends TableColumnBase<T> {
  type: 'badge';
  badgeVariants: Record<string | number, string>;
  badgeLabels: Record<string | number, string>;
}

export type TableColumn<T> =
  | TableColumnText<T>
  | TableColumnNumber<T>
  | TableColumnDate<T>
  | TableColumnBadge<T>;
