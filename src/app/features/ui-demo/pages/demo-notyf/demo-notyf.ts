import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { UiButton } from '../../../../core/ui/ui-button/ui-button';
import { UiCard } from '../../../../core/ui/ui-card/ui-card';
import { UiNotyfService } from '../../../../core/ui/ui-notyf/ui-notyf.service';
import { UiPageHeader } from '../../../../core/ui/ui-page-header/ui-page-header';

@Component({
  selector: 'app-demo-notyf',
  standalone: true,
  imports: [UiPageHeader, UiCard, UiButton],
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
}
