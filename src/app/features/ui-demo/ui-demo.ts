import { ChangeDetectionStrategy, Component } from '@angular/core';
import { RouterLink, RouterOutlet } from '@angular/router';
import { UiCard } from '../../core/ui/ui-card/ui-card';

@Component({
  selector: 'app-ui-demo',
  imports: [RouterLink, RouterOutlet, UiCard],
  templateUrl: './ui-demo.html',
  styleUrl: './ui-demo.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class UiDemo {}
