import { JsonPipe } from '@angular/common';
import { ChangeDetectionStrategy, Component, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { form, FormField, required } from '@angular/forms/signals';
import { UiButton } from '../../../../core/ui/ui-button/ui-button';
import { UiCard } from '../../../../core/ui/ui-card/ui-card';
import { UiPageHeader } from '../../../../core/ui/ui-page-header/ui-page-header';
import { UiSwitch } from '../../../../core/ui/ui-switch/ui-switch';

@Component({
  selector: 'app-demo-switch',
  standalone: true,
  imports: [UiPageHeader, UiCard, UiSwitch, FormsModule, JsonPipe, UiButton, FormField],
  templateUrl: './demo-switch.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: { class: 'flex flex-col gap-4' },
})
export class DemoSwitchPage {
  // Traditional signals
  notificationsEnabled = signal(true);
  marketingEnabled = signal(false);

  // Signal Form
  formState = signal({
    darkMode: false,
    publicProfile: true,
    emailAlerts: false,
  });

  settingsForm = form(this.formState, (p) => {
    // No specific required rules for switches usually, but we can demo one
    required(p.publicProfile, { message: 'Must accept public profile' });
  });

  resetForm() {
    this.settingsForm().reset();
  }

  // Playground Config
  configDisabled = signal(false);
  configChecked = signal(false);
}
