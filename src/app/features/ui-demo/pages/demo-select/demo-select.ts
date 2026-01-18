import { JsonPipe } from '@angular/common';
import { ChangeDetectionStrategy, Component, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { disabled, form, FormField, required } from '@angular/forms/signals';
import { UiButton } from '../../../../core/ui/ui-button/ui-button';
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
  imports: [UiPageHeader, UiCard, UiSelect, FormsModule, JsonPipe, UiButton, FormField],
  templateUrl: './demo-select.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: { class: 'flex flex-col gap-4' },
})
export class DemoSelectPage {
  users: User[] = [
    { id: 1, name: 'Alice' },
    { id: 2, name: 'Bob' },
    { id: 3, name: 'Charlie' },
    { id: 4, name: 'David' },
    { id: 5, name: 'Eve' },
  ];

  departments = [
    { id: 101, name: 'Development' },
    { id: 102, name: 'Design' },
    { id: 103, name: 'Marketing' },
  ];

  // Signal Form
  formState = signal({
    managerId: '',
    departmentId: '',
    teamLeadId: '',
  });

  demoForm = form(this.formState, (p) => {
    required(p.managerId, { message: 'Please select a manager' });

    // Dependent disabled logic
    disabled(p.departmentId, ({ valueOf }) => valueOf(p.managerId) === '');
  });

  resetForm() {
    this.demoForm().reset();
  }

  // Playground Config
  configLabel = signal('Placeholder Label');
  configPlaceholder = signal('Select an option');
  configLoading = signal(false);
  configDisabled = signal(false);
}
