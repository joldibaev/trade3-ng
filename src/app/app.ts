import { ChangeDetectionStrategy, Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { UiNotyf } from './core/ui/ui-notyf/ui-notyf';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, UiNotyf],
  templateUrl: './app.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class App {}
