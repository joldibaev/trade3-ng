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
    { label: 'Главное', route: '/core/dashboard', icon: 'outline-home' },
    {
      label: 'Справочники',
      icon: 'outline-folder',
      children: [
        { label: 'Магазины', route: '/core/directories/stores', icon: 'outline-circle' },
        { label: 'Номенклатура', route: '/core/directories/nomenclature', icon: 'outline-circle' },
        { label: 'Клиенты', route: '/core/directories/clients', icon: 'outline-circle' },
        { label: 'Поставщики', route: '/core/directories/vendors', icon: 'outline-circle' },
        { label: 'Типы цен', route: '/core/directories/price-types', icon: 'outline-circle' },
      ],
    },
    {
      label: 'Документы',
      icon: 'outline-file-text',
      children: [
        { label: 'Закупки', route: '/core/documents/purchases', icon: 'outline-circle' },
        { label: 'Продажи', route: '/core/documents/sales', icon: 'outline-circle' },
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
