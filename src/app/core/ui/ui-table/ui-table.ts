import {
  booleanAttribute,
  ChangeDetectionStrategy,
  Component,
  input,
  ViewEncapsulation,
} from '@angular/core';
import { UiLoading } from '../ui-loading/ui-loading';

@Component({
  selector: 'ui-table',
  imports: [UiLoading],
  templateUrl: './ui-table.html',
  styleUrl: './ui-table.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
  host: {
    class: 'overflow-x-auto',
  },
})
export class UiTable {
  loading = input(false, { transform: booleanAttribute });
  isEmpty = input(false, { transform: booleanAttribute });
}
