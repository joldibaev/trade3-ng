import { ChangeDetectionStrategy, Component, input, numberAttribute } from '@angular/core';

@Component({
  selector: 'ui-list',
  imports: [],
  templateUrl: './ui-list.html',
  styleUrl: './ui-list.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: {
    class: 'block space-y-4',
    '[style.column-count]': 'columnCount()',
  },
})
export class UiList {
  columnCount = input(1, { transform: numberAttribute });
}
