import { ChangeDetectionStrategy, Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { UiNotyfComponent } from './core/ui/ui-notyf/ui-notyf.component';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, UiNotyfComponent],
  templateUrl: './app.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class App {}
