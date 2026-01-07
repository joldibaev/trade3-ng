import { ChangeDetectionStrategy, Component } from '@angular/core';
import { UiSelect } from '../../../../core/ui/ui-select/ui-select';

@Component({
  selector: 'app-ui-demo-select-page',
  imports: [UiSelect],
  templateUrl: './ui-demo-select-page.html',
  styleUrl: './ui-demo-select-page.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class UiDemoSelectPage {}
