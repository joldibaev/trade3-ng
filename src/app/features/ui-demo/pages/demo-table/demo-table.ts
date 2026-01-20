import { CommonModule } from '@angular/common'; // Added DatePipe for use in template
import {
  ChangeDetectionStrategy,
  Component,
  computed,
  Pipe,
  PipeTransform,
  signal,
} from '@angular/core';
import { UiBadge, UiBadgeVariant } from '../../../../core/ui/ui-badge/ui-badge'; // Added UiBadge
import { UiButton } from '../../../../core/ui/ui-button/ui-button';
import { UiCard } from '../../../../core/ui/ui-card/ui-card';
import { UiPageHeader } from '../../../../core/ui/ui-page-header/ui-page-header';
import { UiTable } from '../../../../core/ui/ui-table/ui-table'; // Removed TableColumn

interface User {
  id: number;
  name: string;
  role: string;
  status: 'active' | 'inactive' | 'pending' | 'banned';
  lastLogin: string;
}

@Pipe({
  name: 'userBadgeVariant',
  standalone: true,
})
class UserBadgeVariantPipe implements PipeTransform {
  transform(status: string): UiBadgeVariant {
    switch (status) {
      case 'active':
        return 'success';
      case 'inactive':
        return 'neutral';
      case 'pending':
        return 'warning';
      case 'banned':
        return 'destructive';
      default:
        return 'neutral';
    }
  }
}

@Pipe({
  name: 'userBadgeLabel',
  standalone: true,
})
class UserBadgeLabelPipe implements PipeTransform {
  transform(status: string): string {
    switch (status) {
      case 'active':
        return 'Active';
      case 'inactive':
        return 'Offline';
      case 'pending':
        return 'Pending';
      case 'banned':
        return 'Suspended';
      default:
        return status;
    }
  }
}

@Component({
  selector: 'app-demo-table',
  standalone: true,
  imports: [
    CommonModule,
    UiPageHeader,
    UiCard,
    UiTable,
    UiButton,
    UiBadge,
    UserBadgeVariantPipe,
    UserBadgeLabelPipe,
  ],
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

  onSelect(user: User | undefined) {
    this.selectedUser.set(user);
    const checkboxes = document.querySelectorAll('input[type="checkbox"][name^="select-user"]');
    (checkboxes as any).forEach((cb: HTMLInputElement) => {
      // Reset others
      if (cb.value != user?.id?.toString() && cb.checked) cb.checked = false;
    });
  }

  toggleSelect(user: User, event: Event) {
    const checked = (event.target as HTMLInputElement).checked;
    this.selectedUser.set(checked ? user : undefined);
  }

  // Playground Config
  configLoading = signal(false);
  configEmpty = signal(false);

  tableData = computed(() => {
    return this.configEmpty() ? [] : this.users();
  });
}
