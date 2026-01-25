import { ChangeDetectionStrategy, Component } from '@angular/core';

@Component({
  selector: 'ui-icon-wrapper',
  imports: [],
  templateUrl: './ui-icon-wrapper.html',
  styleUrl: './ui-icon-wrapper.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: {
    class: 'flex shrink-0 items-center justify-center rounded-squircle',
  },
})
export class UiIconWrapper {}
