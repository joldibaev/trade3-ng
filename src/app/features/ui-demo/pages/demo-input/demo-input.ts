import { ChangeDetectionStrategy, Component, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { UiButton } from '../../../../core/ui/ui-button/ui-button';
import { UiCard } from '../../../../core/ui/ui-card/ui-card';
import { UiInput } from '../../../../core/ui/ui-input/ui-input';
import { UiPageHeader } from '../../../../core/ui/ui-page-header/ui-page-header';

@Component({
  selector: 'app-demo-input',
  standalone: true,
  imports: [UiPageHeader, UiCard, UiInput, FormsModule, UiButton],
  templateUrl: './demo-input.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: { class: 'flex flex-col gap-4' },
})
export class DemoInputPage {
  inputValue = signal('Initial value');
  isDisabled = signal(true);

  toggleDisabled() {
    this.isDisabled.update((v) => !v);
  }
}
