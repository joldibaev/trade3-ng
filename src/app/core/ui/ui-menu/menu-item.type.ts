export interface MenuItemLabel {
  id: string;
  label: string;
  items?: MenuItemCollection;
  // class?: string[];
}

export interface MenuItemDivider {
  divider: true;
}

export type MenuItemCollection = (MenuItemLabel | MenuItemDivider)[];
