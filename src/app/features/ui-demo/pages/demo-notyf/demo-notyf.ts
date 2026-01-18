import { ChangeDetectionStrategy, Component, inject, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { UiButton } from '../../../../core/ui/ui-button/ui-button';
import { UiCard } from '../../../../core/ui/ui-card/ui-card';
import { UiNotyfService } from '../../../../core/ui/ui-notyf/ui-notyf.service';
import { UiPageHeader } from '../../../../core/ui/ui-page-header/ui-page-header';

@Component({
  selector: 'app-demo-notyf',
  standalone: true,
  imports: [UiPageHeader, UiCard, UiButton, FormsModule],
  templateUrl: './demo-notyf.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: { class: 'flex flex-col gap-4' },
})
export class DemoNotyfPage {
  private notyf = inject(UiNotyfService);

  showSuccess() {
    this.notyf.success('Operation completed successfully!');
  }

  showError() {
    this.notyf.error('Something went wrong.');
  }

  showInfo() {
    this.notyf.info('This is an informational message.');
  }

  showSuccessWithTitle() {
    this.notyf.success('User updated', 'Success');
  }

  // Playground Config
  configMessage = signal('This is a custom message');
  configType = signal<'success' | 'error' | 'info'>('success');
  configDuration = signal(3000);

  triggerCustom() {
    const type = this.configType();
    const message = this.configMessage();
    const duration = this.configDuration(); // Duration not supported in public API yet, ignoring for now

    switch (type) {
      case 'success':
        this.notyf.success(message);
        break;
      case 'error':
        this.notyf.error(message);
        break;
      case 'info':
        this.notyf.info(message);
        break;
    }
  }
}
