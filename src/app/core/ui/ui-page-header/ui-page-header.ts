import { ChangeDetectionStrategy, Component, input, output } from '@angular/core';
import { UiButton } from '../ui-button/ui-button';

@Component({
  selector: 'ui-page-header',
  standalone: true,
  imports: [UiButton],
  templateUrl: './ui-page-header.html',
  styleUrl: './ui-page-header.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: { class: 'block mb-2' },
})
export class UiPageHeader {
  title = input.required<string>();
  showBack = input(true);
  back = output<void>();
}
