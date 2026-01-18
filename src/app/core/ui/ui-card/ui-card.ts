import { ChangeDetectionStrategy, Component } from '@angular/core';

@Component({
  selector: 'ui-card',
  imports: [],
  templateUrl: './ui-card.html',
  styleUrl: './ui-card.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: {
    class: 'block bg-white rounded-xl border default-border-color overflow-hidden',
  },
})
export class UiCard {}
