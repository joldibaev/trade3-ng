import { DragDropModule } from '@angular/cdk/drag-drop';
import { ChangeDetectionStrategy, Component, input, output } from '@angular/core';
import { UiButton } from '../ui-button/ui-button';
import { UiIcon } from '../ui-icon/ui-icon.component';

@Component({
  selector: 'ui-dialog',
  templateUrl: './ui-dialog.html',
  styleUrl: './ui-dialog.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [DragDropModule, UiButton, UiIcon],
})
export class UiDialog {
  title = input<string>();
  closeAction = output<void>();
}
