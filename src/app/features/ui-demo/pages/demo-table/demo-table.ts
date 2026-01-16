import { ChangeDetectionStrategy, Component, signal } from '@angular/core';
import { UiCard } from '../../../../core/ui/ui-card/ui-card';
import { UiPageHeader } from '../../../../core/ui/ui-page-header/ui-page-header';
import { TableColumn } from '../../../../core/ui/ui-table/table-column.interface';
import { UiTable } from '../../../../core/ui/ui-table/ui-table';

interface User {
  id: number;
  name: string;
  role: string;
  status: 'active' | 'inactive' | 'pending';
  lastLogin: string;
}

@Component({
  selector: 'app-demo-table',
  standalone: true,
  imports: [UiPageHeader, UiCard, UiTable],
  templateUrl: './demo-table.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: { class: 'flex flex-col gap-4' },
})
export class DemoTablePage {
  loading = signal(false);
  selectedUser = signal<User | undefined>(undefined);

  users = signal<User[]>([
    { id: 1, name: 'John Doe', role: 'Admin', status: 'active', lastLogin: '2024-01-01' },
    { id: 2, name: 'Jane Smith', role: 'User', status: 'inactive', lastLogin: '2024-01-02' },
    { id: 3, name: 'Bob Johnson', role: 'Manager', status: 'pending', lastLogin: '2024-01-03' },
  ]);

  columns: TableColumn<User>[] = [
    { key: 'id', header: 'ID', type: 'number', width: '50px' },
    { key: 'name', header: 'Name', type: 'text' },
    { key: 'role', header: 'Role', type: 'text' },
    {
      key: 'status',
      header: 'Status',
      type: 'badge',
      badgeVariants: {
        active: 'success',
        inactive: 'secondary',
        pending: 'outline',
      },
      badgeLabels: {
        active: 'Active',
        inactive: 'Inactive',
        pending: 'Pending',
      },
    },
    { key: 'lastLogin', header: 'Last Login', type: 'date' },
  ];

  onSelect(user: User | undefined) {
    this.selectedUser.set(user);
  }
}
