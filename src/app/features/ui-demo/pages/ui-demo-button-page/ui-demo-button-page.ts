import { ChangeDetectionStrategy, Component, signal } from '@angular/core';
import { UiButton } from '../../../../core/ui/ui-button/ui-button';

@Component({
  selector: 'app-ui-demo-button-page',
  imports: [UiButton],
  templateUrl: './ui-demo-button-page.html',
  styleUrl: './ui-demo-button-page.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: { class: 'flex flex-col gap-4' },
})
export class UiDemoButtonPage {
  loading = signal(false);
  disabled = signal(false);
}
