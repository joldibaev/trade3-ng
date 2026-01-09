import { ChangeDetectionStrategy, Component, signal } from '@angular/core';

@Component({
  selector: 'app-ui-demo-select-page',
  imports: [],
  templateUrl: './ui-demo-select-page.html',
  styleUrl: './ui-demo-select-page.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class UiDemoSelectPage {
  items = signal<string[]>([
    'Important',
    'Starred',
    'Work',
    'Personal',
    'To',
    'Later',
    'Read',
    'Travel',
  ]);

  selectedValue = signal<string[]>(['Important']);
}
