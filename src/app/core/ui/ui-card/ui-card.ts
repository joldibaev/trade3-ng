import { ChangeDetectionStrategy, Component } from '@angular/core';

@Component({
  selector: 'ui-card',
  imports: [],
  templateUrl: './ui-card.html',
  styleUrl: './ui-card.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: { class: 'rounded-sm border bg-gray-50 border-gray-200 p-4' },
})
export class UiCard {}
