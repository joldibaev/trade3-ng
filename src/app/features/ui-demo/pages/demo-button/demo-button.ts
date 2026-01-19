import { ChangeDetectionStrategy, Component, signal } from '@angular/core';
import { UiButton } from '../../../../core/ui/ui-button/ui-button';
import { UiCard } from '../../../../core/ui/ui-card/ui-card';
import { UiPageHeader } from '../../../../core/ui/ui-page-header/ui-page-header';

@Component({
  selector: 'app-demo-button',
  standalone: true,
  imports: [UiPageHeader, UiCard, UiButton],
  templateUrl: './demo-button.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: { class: 'flex flex-col gap-4' },
})
export class DemoButtonPage {
  loading = signal(true);

  toggleLoading() {
    this.loading.update((v) => !v);
  }

  // Playground Config
  configVariant = signal<'primary' | 'secondary' | 'ghost' | 'danger' | 'dashed' | 'link'>(
    'primary',
  );
  configSize = signal<'sm' | 'md' | 'lg'>('md');
  configLoading = signal(false);
  configDisabled = signal(false);
  configFluid = signal(false);
  configIconOnly = signal(false);
  configLabel = signal('Button Text');
}
