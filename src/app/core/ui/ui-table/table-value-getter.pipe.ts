import { Pipe, PipeTransform } from '@angular/core';
import { TableColumn } from './table-column.interface';

@Pipe({
  name: 'tableValueGetter',
})
export class TableValueGetterPipe implements PipeTransform {
  transform<T>(row: T, col: TableColumn<T>, index: number): string | number | null | undefined {
    if (col.valueGetter) {
      return col.valueGetter(row, index);
    }
    return row[col.key] as string | number | null | undefined;
  }
}
