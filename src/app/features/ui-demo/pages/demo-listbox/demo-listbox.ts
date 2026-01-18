import { ChangeDetectionStrategy, Component, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { UiCard } from '../../../../core/ui/ui-card/ui-card';
import { UiListbox } from '../../../../core/ui/ui-listbox/ui-listbox';
import { UiPageHeader } from '../../../../core/ui/ui-page-header/ui-page-header';

interface User {
  id: number;
  name: string;
  email: string;
}

@Component({
  selector: 'app-demo-listbox',
  standalone: true,
  imports: [UiPageHeader, UiCard, UiListbox, FormsModule],
  templateUrl: './demo-listbox.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: { class: 'flex flex-col gap-4' },
})
export class DemoListboxPage {
  users: User[] = [
    { id: 1, name: 'Alice Smith', email: 'alice@example.com' },
    { id: 2, name: 'Bob Johnson', email: 'bob@example.com' },
    { id: 3, name: 'Charlie Williams', email: 'charlie@example.com' },
    { id: 4, name: 'David Brown', email: 'david@example.com' },
    { id: 5, name: 'Eva Davis', email: 'eva@example.com' },
  ];

  selectedUserId = signal('');
  loading = signal(false);

  toggleLoading() {
    this.loading.update((v) => !v);
  }

  // Playground Config
  configLabel = signal('Listbox Label');
  configLoading = signal(false);
  configDisabled = signal(false);
}
