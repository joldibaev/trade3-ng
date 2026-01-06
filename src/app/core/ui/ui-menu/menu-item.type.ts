interface MenuItemLabel {
  id: string;
  label: string;
  // items?: MenuItemCollection[];
  // class?: string[];
}

interface MenuItemDivider {
  divider: true;
}

export type MenuItemCollection = Array<MenuItemLabel | MenuItemDivider>;
