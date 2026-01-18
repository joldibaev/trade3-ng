import { ChangeDetectionStrategy, Component, signal } from '@angular/core';
import { IconName } from '../../../../core/ui/ui-icon/data';
import { FormsModule } from '@angular/forms';
import { UiCard } from '../../../../core/ui/ui-card/ui-card';
import { UiEmptyState } from '../../../../core/ui/ui-empty-state/ui-empty-state';
import { UiNotyfService } from '../../../../core/ui/ui-notyf/ui-notyf.service';
import { UiPageHeader } from '../../../../core/ui/ui-page-header/ui-page-header';

@Component({
  selector: 'app-demo-empty-state',
  standalone: true,
  imports: [UiPageHeader, UiCard, UiEmptyState, FormsModule],
  templateUrl: './demo-empty-state.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: { class: 'flex flex-col gap-4' },
})
export class DemoEmptyStatePage {
  constructor(privatenotyf: UiNotyfService) { }
  private notyf = new UiNotyfService(); // Mock or inject properly

  create() {
    this.notyf.success('Create action triggered');
  }

  refresh() {
    this.notyf.info('Refresh action triggered');
  }

  // Playground Config
  configTitle = signal('No data found');
  configDescription = signal('Try adjusting your search filters or create a new item.');
  configIcon = signal<IconName>('outline-search');
  configActionLabel = signal('Create Item');
}
