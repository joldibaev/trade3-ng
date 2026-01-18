import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, computed, signal } from '@angular/core';
import { UiButton } from '../../../../core/ui/ui-button/ui-button';
import { UiCard } from '../../../../core/ui/ui-card/ui-card';
import { UiPageHeader } from '../../../../core/ui/ui-page-header/ui-page-header';
import { TableColumn } from '../../../../core/ui/ui-table/table-column.interface';
import { UiTable } from '../../../../core/ui/ui-table/ui-table';

interface User {
  id: number;
  name: string;
  role: string;
  status: 'active' | 'inactive' | 'pending' | 'banned';
  lastLogin: string;
}

@Component({
  selector: 'app-demo-table',
  standalone: true,
  imports: [CommonModule, UiPageHeader, UiCard, UiTable, UiButton],
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
    { id: 4, name: 'Alice Brown', role: 'User', status: 'active', lastLogin: '2024-01-04' },
    { id: 5, name: 'Charlie Davis', role: 'Editor', status: 'banned', lastLogin: '2024-01-05' },
  ]);

  columns: TableColumn<User>[] = [
    { key: 'id', header: 'ID', type: 'number', width: '60px' },
    { key: 'name', header: 'User Name', type: 'text' },
    { key: 'role', header: 'System Role', type: 'text' },
    {
      key: 'status',
      header: 'Account Status',
      type: 'badge',
      badgeVariants: {
        active: 'success',
        inactive: 'neutral',
        pending: 'warning',
        banned: 'destructive',
      },
      badgeLabels: {
        active: 'Active',
        inactive: 'Offline',
        pending: 'Pending',
        banned: 'Suspended',
      },
    },
    { key: 'lastLogin', header: 'Last login activity', type: 'date' },
  ];

  onSelect(user: User | undefined) {
    this.selectedUser.set(user);
  }

  // Playground Config
  configLoading = signal(false);
  configEmpty = signal(false);

  tableData = computed(() => {
    return this.configEmpty() ? [] : this.users();
  });
}
