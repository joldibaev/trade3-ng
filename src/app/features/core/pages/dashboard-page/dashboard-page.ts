import { ChangeDetectionStrategy, Component, signal } from '@angular/core';
import { UiButton } from '../../../../core/ui/ui-button/ui-button';

@Component({
  selector: 'app-dashboard-page',
  imports: [UiButton],
  templateUrl: './dashboard-page.html',
  styleUrl: './dashboard-page.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DashboardPage {
  showMore = signal(false);
}
