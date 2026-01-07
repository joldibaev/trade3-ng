import { ChangeDetectionStrategy, Component, signal } from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { UiIcon } from '../../../../core/ui/ui-icon/ui-icon.component';

import { IconName } from '../../../../core/ui/ui-icon/data';

interface MenuItem {
  label: string;
  icon: IconName;
  route?: string;
  children?: MenuItem[];
}

@Component({
  selector: 'app-aside',
  imports: [RouterLink, RouterLinkActive, UiIcon],

  templateUrl: './aside.html',
  styleUrl: './aside.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class Aside {
  menuItems = signal<MenuItem[]>([
    { label: 'Главное', route: '/core/dashboard', icon: 'home' },
    {
      label: 'Справочники',
      icon: 'folder',
      children: [
        { label: 'Магазины', route: '/core/directories/stores', icon: 'circle' },
        { label: 'Категории', route: '/core/directories/categories', icon: 'circle' },
        { label: 'Товары', route: '/core/directories/products', icon: 'circle' },
        { label: 'Клиенты', route: '/core/directories/clients', icon: 'circle' },
        { label: 'Поставщики', route: '/core/directories/vendors', icon: 'circle' },
      ],
    },
    {
      label: 'Документы',
      icon: 'file-text',
      children: [
        { label: 'Закупки', route: '/core/documents/purchases', icon: 'circle' },
        { label: 'Продажи', route: '/core/documents/sales', icon: 'circle' },
      ],
    },
  ]);

  expandedGroups = signal<Set<string>>(new Set(['Справочники', 'Документы'])); // Default expanded for visibility

  toggleGroup(label: string) {
    this.expandedGroups.update((set) => {
      const newSet = new Set(set);
      if (newSet.has(label)) {
        newSet.delete(label);
      } else {
        newSet.add(label);
      }
      return newSet;
    });
  }

  isExpanded(label: string): boolean {
    return this.expandedGroups().has(label);
  }
}
