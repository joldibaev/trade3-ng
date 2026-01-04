import {ChangeDetectionStrategy, Component, input, output, viewChild} from '@angular/core';
import {Menu as AriaMenu, MenuItem} from '@angular/aria/menu';

@Component({
  selector: 'ui-menu',
  imports: [AriaMenu, MenuItem],
  templateUrl: './menu.html',
  styleUrl: './menu.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: {
    class: 'block'
  }
})
export class Menu {
  items = input<{ id: string; label: string }[]>([]);
  itemSelected = output<string>();

  // Expose the AriaMenu directive for the trigger to bind to
  menu = viewChild.required(AriaMenu);
}
