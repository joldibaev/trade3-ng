export interface TableColumn<T> {
  key: keyof T;
  header: string;
  editable?: boolean;
  type?: 'text' | 'number' | 'date';
  width?: string;
  valueGetter?: (row: T, index: number) => string | number | null | undefined;
}
