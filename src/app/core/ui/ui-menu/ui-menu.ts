import { Menu, MenuItem, MenuTrigger } from '@angular/aria/menu';
import { CdkConnectedOverlay, CdkOverlayOrigin, OverlayModule } from '@angular/cdk/overlay';
import { ChangeDetectionStrategy, Component, input, viewChild } from '@angular/core';
import { MenuItemCollection } from './menu-item.type';

@Component({
  selector: 'ui-menu',
  imports: [Menu, MenuItem, CdkConnectedOverlay, OverlayModule],
  templateUrl: './ui-menu.html',
  styleUrl: './ui-menu.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: {
    class: 'block',
  },
})
export class UiMenu {
  items = input<MenuItemCollection>([]);
  formatMenu = viewChild<Menu<string>>('formatMenu');

  trigger = input.required<MenuTrigger<string>>();
  origin = input.required<CdkOverlayOrigin>();
}
