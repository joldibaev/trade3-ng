import { Menu, MenuContent, MenuItem } from '@angular/aria/menu';
import {
  CdkConnectedOverlay,
  CdkOverlayOrigin,
  ConnectedPosition,
  OverlayModule,
} from '@angular/cdk/overlay';
import {
  ChangeDetectionStrategy,
  Component,
  input,
  viewChild,
  ViewEncapsulation,
} from '@angular/core';
import { MenuItemCollection } from './menu-item.type';

import { UiIcon } from '../ui-icon/ui-icon.component';

@Component({
  selector: 'ui-menu',
  imports: [Menu, CdkConnectedOverlay, OverlayModule, MenuContent, MenuItem, UiIcon],
  templateUrl: './ui-menu.html',
  styleUrl: './ui-menu.css',
  host: {
    class: 'block',
  },
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class UiMenu {
  visible = input.required<boolean>();
  origin = input.required<HTMLElement | CdkOverlayOrigin>();
  items = input<MenuItemCollection>();
  overlayPositions = input<ConnectedPosition[]>([]);

  menu = viewChild<Menu<string>>('ngMenu');
}
