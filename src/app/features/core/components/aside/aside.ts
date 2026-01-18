import { ChangeDetectionStrategy, Component, signal } from '@angular/core';
import { UiIcon } from '../../../../core/ui/ui-icon/ui-icon.component';
import { TreeNode } from '../../../../core/ui/ui-tree/tree-item.interface';
import { UiTree } from '../../../../core/ui/ui-tree/ui-tree';

@Component({
  selector: 'app-aside',
  imports: [UiIcon, UiTree],
  templateUrl: './aside.html',
  styleUrl: './aside.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class Aside {
  menuItems = signal<TreeNode[]>([
    {
      id: 'dashboard',
      label: 'Главная',
      routerLink: ['/core', 'dashboard'],
      icon: 'outline-home',
      expanded: false,
      children: [],
    },
    {
      id: 'directories',
      label: 'Справочники',
      icon: 'outline-folder',
      expanded: true,
      children: [
        {
          id: 'stores',
          label: 'Магазины',
          routerLink: ['/core', 'directories', 'stores'],
          icon: 'outline-building-store',
          expanded: false,
          children: [],
        },
        {
          id: 'nomenclature',
          label: 'Номенклатура',
          routerLink: ['/core', 'directories', 'nomenclature'],
          icon: 'outline-box',
          expanded: false,
          children: [],
        },
        {
          id: 'clients',
          label: 'Клиенты',
          routerLink: ['/core', 'directories', 'clients'],
          icon: 'outline-users',
          expanded: false,
          children: [],
        },
        {
          id: 'vendors',
          label: 'Поставщики',
          routerLink: ['/core', 'directories', 'vendors'],
          icon: 'outline-truck',
          expanded: false,
          children: [],
        },
        {
          id: 'price-types',
          label: 'Типы цен',
          routerLink: ['/core', 'directories', 'price-types'],
          icon: 'outline-currency-dollar',
          expanded: false,
          children: [],
        },
      ],
    },
    {
      id: 'documents',
      label: 'Документы',
      icon: 'outline-file-text',
      expanded: true,
      children: [
        {
          id: 'purchases',
          label: 'Приходные накладные',
          routerLink: ['/core', 'documents', 'purchases'],
          icon: 'outline-file-import',
          expanded: false,
          children: [],
        },
      ],
    },
  ]);
}
