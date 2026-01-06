import { Menu, MenuContent, MenuItem } from '@angular/aria/menu';
import {
  CdkConnectedOverlay,
  CdkOverlayOrigin,
  ConnectedPosition,
  OverlayModule,
} from '@angular/cdk/overlay';
import { ChangeDetectionStrategy, Component, input, viewChild } from '@angular/core';
import { MenuItemCollection } from './menu-item.type';

@Component({
  selector: 'ui-menu',
  imports: [Menu, CdkConnectedOverlay, OverlayModule, MenuContent, MenuItem],
  templateUrl: './ui-menu.html',
  styleUrl: './ui-menu.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: {
    class: 'block',
  },
})
export class UiMenu {
  visible = input.required<boolean>();
  origin = input.required<HTMLElement | CdkOverlayOrigin>();
  items = input<MenuItemCollection>();
  overlayPositions = input<ConnectedPosition[]>([]);

  menu = viewChild<Menu<string>>('menuEl');
}
