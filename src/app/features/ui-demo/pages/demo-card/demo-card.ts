import { ChangeDetectionStrategy, Component } from '@angular/core';
import { UiCard } from '../../../../core/ui/ui-card/ui-card';
import { UiPageHeader } from '../../../../core/ui/ui-page-header/ui-page-header';

@Component({
  selector: 'app-demo-card',
  standalone: true,
  imports: [UiPageHeader, UiCard],
  templateUrl: './demo-card.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: { class: 'flex flex-col gap-4' },
})
export class DemoCardPage {}
