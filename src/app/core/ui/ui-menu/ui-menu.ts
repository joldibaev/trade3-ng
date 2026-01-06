import { Menu, MenuItem } from '@angular/aria/menu';
import { ChangeDetectionStrategy, Component, input, viewChild } from '@angular/core';

@Component({
  selector: 'ui-menu',
  imports: [Menu, MenuItem],
  templateUrl: './ui-menu.html',
  styleUrl: './ui-menu.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: {
    class: 'block',
  },
})
export class UiMenu {
  items = input<{ id: string; label: string }[]>([]);
  formatMenu = viewChild.required<Menu<string>>('formatMenu');
}
