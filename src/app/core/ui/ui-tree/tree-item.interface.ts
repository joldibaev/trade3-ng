import { QueryParamsHandling } from '@angular/router';
import { IconName } from '../ui-icon/data';

export interface TreeNode {
  id: string;
  label: string;
  children: TreeNode[];
  expanded: boolean;

  icon?: IconName;
  routerLink?: string[];
  queryParams?: Record<string, string>;
  queryParamsHandling?: QueryParamsHandling;
}
