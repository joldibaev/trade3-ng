import { ChangeDetectionStrategy, Component } from '@angular/core';
import { RouterLink, RouterOutlet } from '@angular/router';
import { UiCard } from './core/ui/ui-card/ui-card';

@Component({
  selector: 'app-root',
  imports: [RouterLink, RouterOutlet, UiCard],
  templateUrl: './app.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class App {}
