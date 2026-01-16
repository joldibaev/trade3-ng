import { ChangeDetectionStrategy, Component } from '@angular/core';
import { UiBadge } from '../../../../core/ui/ui-badge/ui-badge';
import { UiCard } from '../../../../core/ui/ui-card/ui-card';
import { UiPageHeader } from '../../../../core/ui/ui-page-header/ui-page-header';

@Component({
  selector: 'app-demo-badge',
  standalone: true,
  imports: [UiPageHeader, UiCard, UiBadge],
  templateUrl: './demo-badge.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: { class: 'flex flex-col gap-4' },
})
export class DemoBadgePage {}
