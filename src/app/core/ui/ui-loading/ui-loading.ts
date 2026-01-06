import { ChangeDetectionStrategy, Component } from '@angular/core';

@Component({
  selector: 'ui-loading',
  imports: [],
  templateUrl: './ui-loading.html',
  styleUrl: './ui-loading.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class UiLoading {}
