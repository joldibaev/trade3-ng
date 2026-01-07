import { ChangeDetectionStrategy, Component } from '@angular/core';

@Component({
  selector: 'ui-dialog',
  templateUrl: './ui-dialog.html',
  styleUrl: './ui-dialog.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: {
    class: 'block w-[90vw] sm:w-[500px] rounded-xl bg-white p-6 shadow-2xl animate-in zoom-in-95',
  },
})
export class UiDialog {}
