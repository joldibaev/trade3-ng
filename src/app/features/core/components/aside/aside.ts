import { Tree, TreeItem, TreeItemGroup } from '@angular/aria/tree';
import { NgTemplateOutlet } from '@angular/common';
import { ChangeDetectionStrategy, Component, signal } from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { UiIcon } from '../../../../core/ui/ui-icon/ui-icon.component';

import { UiButton } from '../../../../core/ui/ui-button/ui-button';
import { IconName } from '../../../../core/ui/ui-icon/data';

interface MenuItem {
  label: string;
  icon: IconName;
  expanded: boolean;
  route?: string;
  children?: MenuItem[];
}

@Component({
  selector: 'app-aside',
  imports: [
    RouterLink,
    UiIcon,
    Tree,
    TreeItem,
    NgTemplateOutlet,
    UiButton,
    TreeItemGroup,
    RouterLinkActive,
  ],
  templateUrl: './aside.html',
  styleUrl: './aside.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class Aside {
  menuItems = signal<MenuItem[]>([
    {
      label: 'Главная',
      route: '/core/dashboard',
      icon: 'outline-home',
      expanded: false,
    },
    {
      label: 'Справочники',
      icon: 'outline-folder',
      expanded: true,
      children: [
        {
          label: 'Магазины',
          route: '/core/directories/stores',
          icon: 'outline-building-store',
          expanded: false,
        },
        {
          label: 'Номенклатура',
          route: '/core/directories/nomenclature',
          icon: 'outline-box',
          expanded: false,
        },
        {
          label: 'Клиенты',
          route: '/core/directories/clients',
          icon: 'outline-users',
          expanded: false,
        },
        {
          label: 'Поставщики',
          route: '/core/directories/vendors',
          icon: 'outline-truck',
          expanded: false,
        },
        {
          label: 'Типы цен',
          route: '/core/directories/price-types',
          icon: 'outline-currency-dollar',
          expanded: false,
        },
      ],
    },
    {
      label: 'Документы',
      icon: 'outline-file-text',
      expanded: true,
      children: [
        {
          label: 'Приходные накладные',
          route: '/core/documents/purchases',
          icon: 'outline-file-import',
          expanded: false,
        },
        // { label: 'Продажи', route: '/core/documents/sales', icon: 'outline-receipt' }
      ],
    },
  ]);
}
