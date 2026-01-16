import { OverlayModule } from '@angular/cdk/overlay';
import { ChangeDetectionStrategy, Component, signal } from '@angular/core';
import { UiButton } from '../../../../core/ui/ui-button/ui-button';
import { UiCard } from '../../../../core/ui/ui-card/ui-card';
import { MenuItemCollection } from '../../../../core/ui/ui-menu/menu-item.type';
import { UiMenu } from '../../../../core/ui/ui-menu/ui-menu';
import { UiPageHeader } from '../../../../core/ui/ui-page-header/ui-page-header';

@Component({
  selector: 'app-demo-menu',
  standalone: true,
  imports: [UiPageHeader, UiCard, UiButton, UiMenu, OverlayModule],
  templateUrl: './demo-menu.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: { class: 'flex flex-col gap-4' },
})
export class DemoMenuPage {
  isOpen = signal(false);

  menuItems: MenuItemCollection = [
    { id: 'profile', label: 'Profile' },
    { id: 'settings', label: 'Settings' },
    { divider: true },
    { id: 'logout', label: 'Logout' },
  ];
}
