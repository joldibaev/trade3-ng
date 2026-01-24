import { ChangeDetectionStrategy, Component } from '@angular/core';

@Component({
  selector: 'ui-list',
  imports: [],
  templateUrl: './ui-list.html',
  styleUrl: './ui-list.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: {
    class: 'flex flex-col gap-3',
  },
})
export class UiList {}
