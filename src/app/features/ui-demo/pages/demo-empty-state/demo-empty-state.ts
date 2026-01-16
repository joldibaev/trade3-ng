import { ChangeDetectionStrategy, Component } from '@angular/core';
import { UiCard } from '../../../../core/ui/ui-card/ui-card';
import { UiEmptyState } from '../../../../core/ui/ui-empty-state/ui-empty-state';
import { UiNotyfService } from '../../../../core/ui/ui-notyf/ui-notyf.service';
import { UiPageHeader } from '../../../../core/ui/ui-page-header/ui-page-header';

@Component({
  selector: 'app-demo-empty-state',
  standalone: true,
  imports: [UiPageHeader, UiCard, UiEmptyState],
  templateUrl: './demo-empty-state.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: { class: 'flex flex-col gap-4' },
})
export class DemoEmptyStatePage {
  constructor(private notyf: UiNotyfService) {}

  create() {
    this.notyf.success('Create action triggered');
  }

  refresh() {
    this.notyf.info('Refresh action triggered');
  }
}
