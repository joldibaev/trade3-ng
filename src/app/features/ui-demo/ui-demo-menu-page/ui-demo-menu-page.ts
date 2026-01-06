import { MenuTrigger } from '@angular/aria/menu';
import { CdkOverlayOrigin } from '@angular/cdk/overlay';
import { ChangeDetectionStrategy, Component } from '@angular/core';
import { UiButton } from '../../../core/ui/ui-button/ui-button';
import { MenuItemCollection } from '../../../core/ui/ui-menu/menu-item.type';
import { UiMenu } from '../../../core/ui/ui-menu/ui-menu';

@Component({
  selector: 'app-ui-demo-menu-page',
  imports: [UiMenu, UiButton, MenuTrigger, CdkOverlayOrigin],
  templateUrl: './ui-demo-menu-page.html',
  styleUrl: './ui-demo-menu-page.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: { class: 'flex flex-col gap-4' },
})
export class UiDemoMenuPage {
  menuItems: MenuItemCollection = [
    { id: 'create', label: 'Создать' },
    { id: 'open', label: 'Открыть' },
    { divider: true },
    {
      id: 'share',
      label: 'Поделиться',
      // items: [
      //   { id: 'telegram', label: 'Телеграм' },
      //   { id: 'instagram', label: 'Инстаграм' },
      // ],
    },
    { id: 'print', label: 'Распечатать' },
    { id: 'rename', label: 'Переименовать' },
    { divider: true },
    { id: 'delete', label: 'Удалить' },
  ];

  onAction(item: { id: string; label: string }) {
    console.log('Menu Action:', item);
    alert(`Selected: ${item.label}`);
  }
}
