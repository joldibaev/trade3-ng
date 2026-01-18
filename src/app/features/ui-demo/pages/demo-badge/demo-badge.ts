import { ChangeDetectionStrategy, Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { UiBadge, UiBadgeMode, UiBadgeSize, UiBadgeVariant } from '../../../../core/ui/ui-badge/ui-badge';
import { UiCard } from '../../../../core/ui/ui-card/ui-card';
import { UiIcon } from '../../../../core/ui/ui-icon/ui-icon.component';
import { UiPageHeader } from '../../../../core/ui/ui-page-header/ui-page-header';

@Component({
  selector: 'app-demo-badge',
  standalone: true,
  imports: [UiPageHeader, UiCard, UiBadge, UiIcon, FormsModule],
  templateUrl: './demo-badge.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: { class: 'flex flex-col gap-4' },
})
export class DemoBadgePage {
  configLabel = 'Badge';
  configVariant: UiBadgeVariant = 'primary';
  configMode: UiBadgeMode = 'solid';
  configSize: UiBadgeSize = 'md';
}
