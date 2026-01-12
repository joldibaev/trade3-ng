import { Tree, TreeItem, TreeItemGroup } from '@angular/aria/tree';
import { NgTemplateOutlet } from '@angular/common';
import { ChangeDetectionStrategy, Component, input, model } from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { UiButton } from '../ui-button/ui-button';
import { UiIcon } from '../ui-icon/ui-icon.component';
import { TreeNode } from './tree-item.interface';

@Component({
  selector: 'ui-tree',
  standalone: true,
  imports: [
    Tree,
    TreeItem,
    TreeItemGroup,
    NgTemplateOutlet,
    UiIcon,
    UiButton,
    RouterLink,
    RouterLinkActive,
  ],
  templateUrl: './ui-tree.html',
  styleUrl: './ui-tree.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class UiTree {
  items = input.required<TreeNode[]>();
  selected = model<string[]>([]);
}
