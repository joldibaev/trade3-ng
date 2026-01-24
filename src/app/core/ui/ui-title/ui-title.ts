import { ChangeDetectionStrategy, Component, input } from '@angular/core';

@Component({
  selector: 'ui-title',
  imports: [],
  templateUrl: './ui-title.html',
  styleUrl: './ui-title.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: { class: 'flex flex-col gap-1' },
})
export class UiTitle {
  title = input.required<string>();
  caption = input<string>();
}
