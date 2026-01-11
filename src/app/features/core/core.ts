import { ChangeDetectionStrategy, Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { Aside } from './components/aside/aside';

@Component({
  selector: 'app-core',
  imports: [Aside, RouterOutlet],
  templateUrl: './core.html',
  styleUrl: './core.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: { class: 'flex min-h-screen min-h-[600px]' },
})
export class Core {}
