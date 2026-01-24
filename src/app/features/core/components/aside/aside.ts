import { NgOptimizedImage } from '@angular/common';
import { ChangeDetectionStrategy, Component, signal } from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { UiButton } from '../../../../core/ui/ui-button/ui-button';
import { IconName } from '../../../../core/ui/ui-icon/data';

interface NavItem {
  id: string;
  label: string;
  icon: IconName;
  routerLink?: string[];
  children?: NavItem[];
}

interface NavGroup {
  label: string;
  items: NavItem[];
}

@Component({
  selector: 'app-aside',
  imports: [RouterLink, RouterLinkActive, UiButton, NgOptimizedImage],
  templateUrl: './aside.html',
  styleUrl: './aside.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: {
    class:
      'default-border-color sticky top-0 h-screen shrink-0 border-e bg-white default-transition flex flex-col',
    '[class.w-72]': '!isCollapsed()',
    '[class.w-20]': 'isCollapsed()',
  },
})
export class Aside {
  isCollapsed = signal(false);
  protected expandedGroups = signal<Set<string>>(new Set(['directories', 'documents']));

  menuGroups = signal<NavGroup[]>([
    {
      label: 'ОБЗОР',
      items: [
        {
          id: 'dashboard',
          label: 'Главная',
          routerLink: ['/core', 'dashboard'],
          icon: 'outline-home',
        },
      ],
    },
    {
      label: 'СПРАВОЧНИКИ',
      items: [
        {
          id: 'stocks',
          label: 'Товары',
          routerLink: ['/core', 'directories', 'nomenclature'],
          icon: 'outline-box',
        },
        {
          id: 'clients',
          label: 'Клиенты',
          routerLink: ['/core', 'directories', 'clients'],
          icon: 'outline-users',
        },
        {
          id: 'vendors',
          label: 'Поставщики',
          routerLink: ['/core', 'directories', 'vendors'],
          icon: 'outline-truck',
        },
        {
          id: 'stores',
          label: 'Магазины',
          routerLink: ['/core', 'directories', 'stores'],
          icon: 'outline-building-store',
        },
      ],
    },
    {
      label: 'ДОКУМЕНТЫ',
      items: [
        {
          id: 'purchases',
          label: 'Закупки',
          routerLink: ['/core', 'documents', 'purchases'],
          icon: 'outline-file-import',
        },
      ],
    },
    {
      label: 'СИСТЕМА',
      items: [
        {
          id: 'settings',
          label: 'Настройки',
          routerLink: ['/core', 'settings'],
          icon: 'outline-settings',
        },
      ],
    },
  ]);

  toggle() {
    this.isCollapsed.update((v) => !v);
  }

  toggleGroup(id: string) {
    this.expandedGroups.update((prev) => {
      const next = new Set(prev);
      if (next.has(id)) {
        next.delete(id);
      } else {
        next.add(id);
      }
      return next;
    });
  }
}
