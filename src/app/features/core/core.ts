import { ChangeDetectionStrategy, Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { UiNotyf } from '../../core/ui/ui-notyf/ui-notyf';
import { Aside } from './components/aside/aside';

@Component({
  selector: 'app-core',
  imports: [Aside, RouterOutlet, UiNotyf],
  templateUrl: './core.html',
  styleUrl: './core.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: { class: 'flex' },
})
export class Core {}
