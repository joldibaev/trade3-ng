import { ChangeDetectionStrategy, Component, input } from '@angular/core';
import { Grid, GridRow, GridCell } from '@angular/aria/grid';

export interface TableColumn {
    key: string;
    header: string;
}

@Component({
    selector: 'ui-table',
    imports: [Grid, GridRow, GridCell],
    templateUrl: './table.html',
    styleUrl: './table.css',
    changeDetection: ChangeDetectionStrategy.OnPush,
    host: {
        class: 'block w-full overflow-x-auto'
    }
})
export class Table {
    columns = input.required<TableColumn[]>();
    data = input.required<any[]>();
}
