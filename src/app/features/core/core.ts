import { ChangeDetectionStrategy, Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { UiNotyfComponent } from '../../core/ui/ui-notyf/ui-notyf.component';
import { Aside } from './components/aside/aside';

@Component({
  selector: 'app-core',
  imports: [Aside, RouterOutlet, UiNotyfComponent],
  templateUrl: './core.html',
  styleUrl: './core.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class Core { }
