import { ChangeDetectionStrategy, Component, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { UiCard } from '../../../../core/ui/ui-card/ui-card';
import { UiLoading } from '../../../../core/ui/ui-loading/ui-loading';
import { UiPageHeader } from '../../../../core/ui/ui-page-header/ui-page-header';

@Component({
  selector: 'app-demo-loading',
  standalone: true,
  imports: [UiPageHeader, UiCard, UiLoading, FormsModule],
  templateUrl: './demo-loading.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: { class: 'flex flex-col gap-4' },
})
export class DemoLoadingPage {
  configSize = signal(48);
}
