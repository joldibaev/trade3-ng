import { ChangeDetectionStrategy, Component, signal } from '@angular/core';
import { UiButton } from '../../../../core/ui/ui-button/ui-button';
import { UiCard } from '../../../../core/ui/ui-card/ui-card';
import { UiPageHeader } from '../../../../core/ui/ui-page-header/ui-page-header';
import { TreeNode } from '../../../../core/ui/ui-tree/tree-item.interface';
import { UiTree } from '../../../../core/ui/ui-tree/ui-tree';

@Component({
  selector: 'app-demo-tree',
  standalone: true,
  imports: [UiPageHeader, UiCard, UiTree, UiButton],
  templateUrl: './demo-tree.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: { class: 'flex flex-col gap-4' },
})
export class DemoTreePage {
  files = signal<TreeNode[]>([
    {
      id: 'src',
      label: 'src',
      expanded: true,
      icon: 'outline-folder',
      children: [
        {
          id: 'app',
          label: 'app',
          expanded: true,
          icon: 'outline-folder',
          children: [
            { id: 'core', label: 'core', expanded: false, icon: 'outline-folder', children: [] },
            {
              id: 'features',
              label: 'features',
              expanded: false,
              icon: 'outline-folder',
              children: [],
            },
          ],
        },
        { id: 'assets', label: 'assets', expanded: false, icon: 'outline-folder', children: [] },
        {
          id: 'main.ts',
          label: 'main.ts',
          expanded: false,
          icon: 'outline-file-text',
          children: [],
        },
      ],
    },
    {
      id: 'angular.json',
      label: 'angular.json',
      expanded: false,
      icon: 'outline-file-text',
      children: [],
    },
  ]);

  expandAll() {
    this.files.update((nodes) => this.toggleNodes(nodes, true));
  }

  collapseAll() {
    this.files.update((nodes) => this.toggleNodes(nodes, false));
  }

  private toggleNodes(nodes: TreeNode[], expanded: boolean): TreeNode[] {
    return nodes.map((node) => ({
      ...node,
      expanded: node.children?.length ? expanded : false,
      children: node.children ? this.toggleNodes(node.children, expanded) : [],
    }));
  }
}
