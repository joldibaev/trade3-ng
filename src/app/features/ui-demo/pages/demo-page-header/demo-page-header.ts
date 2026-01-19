import { ChangeDetectionStrategy, Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { UiButton } from '../../../../core/ui/ui-button/ui-button';
import { UiCard } from '../../../../core/ui/ui-card/ui-card';
import { UiPageHeader } from '../../../../core/ui/ui-page-header/ui-page-header';

@Component({
  selector: 'app-demo-page-header',
  standalone: true,
  imports: [UiPageHeader, UiCard, FormsModule, UiButton],
  templateUrl: './demo-page-header.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: { class: 'flex flex-col gap-4' },
})
export class DemoPageHeaderPage {
  configTitle = 'Dynamic Header';
  configShowBack = true;
}
