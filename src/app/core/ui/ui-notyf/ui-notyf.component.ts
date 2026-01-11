import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { UiIcon } from '../ui-icon/ui-icon.component';
import { UiNotyfService } from './ui-notyf.service';

@Component({
  selector: 'ui-notyf',
  imports: [UiIcon],
  templateUrl: './ui-notyf.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class UiNotyfComponent {
  protected readonly notyf = inject(UiNotyfService);
}
