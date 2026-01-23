import {
  CDK_TABLE,
  CdkTable,
  DataRowOutlet,
  FooterRowOutlet,
  HeaderRowOutlet,
  NoDataRowOutlet,
} from '@angular/cdk/table';
import {
  booleanAttribute,
  ChangeDetectionStrategy,
  Component,
  input,
  ViewEncapsulation,
} from '@angular/core';

@Component({
  selector: 'ui-table',
  imports: [HeaderRowOutlet, DataRowOutlet, NoDataRowOutlet, FooterRowOutlet],
  templateUrl: './ui-table.html',
  styleUrl: './ui-table.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
  host: {
    class: 'overflow-x-auto',
  },
  providers: [
    { provide: CdkTable, useExisting: UiTable },
    { provide: CDK_TABLE, useExisting: UiTable },
  ],
})
export class UiTable<T> extends CdkTable<T> {
  loading = input(false, { transform: booleanAttribute });
  isEmpty = input(false, { transform: booleanAttribute });
}
