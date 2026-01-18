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
    {
      id: 'file',
      label: 'File',
      items: [
        { id: 'new', label: 'New Project' },
        { id: 'open', label: 'Open...' },
        { divider: true },
        { id: 'save', label: 'Save' },
      ],
    },
    {
      id: 'edit',
      label: 'Edit',
      items: [
        { id: 'undo', label: 'Undo' },
        { id: 'redo', label: 'Redo' },
        { divider: true },
        {
          id: 'find',
          label: 'Find & Replace',
          items: [
            { id: 'find-next', label: 'Find Next' },
            { id: 'find-prev', label: 'Find Previous' },
          ],
        },
      ],
    },
    { divider: true },
    { id: 'settings', label: 'Settings' },
    { id: 'logout', label: 'Logout' },
  ];

  simpleMenuItems: MenuItemCollection = [
    { id: 'view', label: 'View Details' },
    { id: 'edit', label: 'Edit' },
    { id: 'delete', label: 'Delete' },
  ];

  isSimpleOpen = signal(false);
}
