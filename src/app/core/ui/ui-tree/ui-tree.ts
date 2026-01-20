import { Tree, TreeItem, TreeItemGroup } from '@angular/aria/tree';
import { NgTemplateOutlet } from '@angular/common';
import { ChangeDetectionStrategy, Component, input, model, ViewEncapsulation } from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { UiIcon } from '../ui-icon/ui-icon.component';
import { TreeNode } from './tree-item.interface';

@Component({
  selector: 'ui-tree',
  imports: [Tree, TreeItem, TreeItemGroup, NgTemplateOutlet, UiIcon, RouterLink, RouterLinkActive],
  templateUrl: './ui-tree.html',
  styleUrl: './ui-tree.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
})
export class UiTree {
  items = input.required<TreeNode[]>();
  selected = model<string[]>([]);
}
