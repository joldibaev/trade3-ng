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
    if (col.key in (row as object)) {
      return (row as Record<string, unknown>)[col.key as string] as
        | string
        | number
        | null
        | undefined;
    }
    return undefined;
  }
}
