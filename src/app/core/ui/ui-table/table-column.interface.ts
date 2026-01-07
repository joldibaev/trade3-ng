export interface TableColumn<T> {
  key: keyof T;
  header: string;
  editable?: boolean;
  type?: 'text' | 'number' | 'date';
}
