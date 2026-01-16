import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { UiButton } from '../ui-button/ui-button';
import { UiIcon } from '../ui-icon/ui-icon.component';
import { UiNotyfService } from './ui-notyf.service';

@Component({
  selector: 'ui-notyf',
  imports: [UiIcon, UiButton],
  templateUrl: './ui-notyf.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: {
    class: 'ui-notyf-viewport',
  },
})
export class UiNotyf {
  protected readonly notyf = inject(UiNotyfService);
}
