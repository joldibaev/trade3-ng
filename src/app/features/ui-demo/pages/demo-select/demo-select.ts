import { ChangeDetectionStrategy, Component, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { UiCard } from '../../../../core/ui/ui-card/ui-card';
import { UiPageHeader } from '../../../../core/ui/ui-page-header/ui-page-header';
import { UiSelect } from '../../../../core/ui/ui-select/ui-select';

interface User {
  id: number;
  name: string;
}

@Component({
  selector: 'app-demo-select',
  standalone: true,
  imports: [UiPageHeader, UiCard, UiSelect, FormsModule],
  templateUrl: './demo-select.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: { class: 'flex flex-col gap-4' },
})
export class DemoSelectPage {
  users: User[] = [
    { id: 1, name: 'Alice' },
    { id: 2, name: 'Bob' },
    { id: 3, name: 'Charlie' },
  ];
  selectedUserId = signal('');
}
