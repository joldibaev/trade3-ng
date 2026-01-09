import {
    ChangeDetectionStrategy,
    Component,
    effect,
    input,
    model,
    untracked,
} from '@angular/core';
import { Tree, TreeItem, TreeItemGroup } from '@angular/aria/tree';
import { NgTemplateOutlet } from '@angular/common';
import { UiIcon } from '../ui-icon/ui-icon.component';

export interface UiTreeItem {
    id: string;
    name: string;
    children?: UiTreeItem[];
    [key: string]: any;
}

@Component({
    selector: 'ui-tree',
    standalone: true,
    imports: [Tree, TreeItem, TreeItemGroup, NgTemplateOutlet, UiIcon],
    templateUrl: './ui-tree.html',
    styleUrl: './ui-tree.css',
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class UiTree<T extends UiTreeItem> {
    items = input.required<T[]>();

    // External selection state (single string ID)
    selectedId = model<string | undefined>(undefined);

    // Internal Aria Tree state (ModelSignal<string[]>)
    readonly selectionValues = model<string[]>([]);

    constructor() {
        // Sync external selectedId -> internal selectionValues
        effect(() => {
            const id = this.selectedId();
            untracked(() => {
                const current = this.selectionValues();
                if (id && (!current.length || current[0] !== id)) {
                    this.selectionValues.set([id]);
                } else if (!id && current.length) {
                    this.selectionValues.set([]);
                }
            });
        });

        // Sync internal selectionValues -> external selectedId
        effect(() => {
            const values = this.selectionValues();
            untracked(() => {
                const currentId = this.selectedId();
                if (values.length > 0 && values[0] !== currentId) {
                    this.selectedId.set(values[0]);
                } else if (values.length === 0 && currentId) {
                    this.selectedId.set(undefined);
                }
            });
        });
    }
}
