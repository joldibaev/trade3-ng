import { JsonPipe } from '@angular/common';
import { ChangeDetectionStrategy, Component, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { form, FormField, required } from '@angular/forms/signals';
import { UiButton } from '../../../../core/ui/ui-button/ui-button';
import { UiCard } from '../../../../core/ui/ui-card/ui-card';
import { UiCheckbox } from '../../../../core/ui/ui-checkbox/ui-checkbox';
import { UiPageHeader } from '../../../../core/ui/ui-page-header/ui-page-header';

@Component({
  selector: 'app-demo-checkbox',
  standalone: true,
  imports: [UiPageHeader, UiCard, UiCheckbox, FormsModule, JsonPipe, UiButton, FormField],
  templateUrl: './demo-checkbox.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: { class: 'flex flex-col gap-4' },
})
export class DemoCheckboxPage {
  // Traditional signals
  termsAccepted = signal(false);

  // Signal Form
  formState = signal({
    newsletter: true,
    privacyPolicy: false,
    analytics: true,
  });

  preferencesForm = form(this.formState, (p) => {
    required(p.privacyPolicy, { message: 'You must accept the privacy policy' });
  });

  resetForm() {
    this.preferencesForm().reset();
  }

  // Playground Config
  configLabel = signal('Checkbox Label');
  configDisabled = signal(false);
  configInvalid = signal(false);
}
