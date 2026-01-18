import { Dialog, DialogModule } from '@angular/cdk/dialog';
import { ChangeDetectionStrategy, Component, inject, signal } from '@angular/core';
import { UiButton } from '../../../../core/ui/ui-button/ui-button';
import { UiCard } from '../../../../core/ui/ui-card/ui-card';
import { UiDialogConfirm } from '../../../../core/ui/ui-dialog-confirm/ui-dialog-confirm';
import { UiDialogConfirmData } from '../../../../core/ui/ui-dialog-confirm/ui-dialog-confirm-data.interface';
import { UiDialog } from '../../../../core/ui/ui-dialog/ui-dialog';
import { UiPageHeader } from '../../../../core/ui/ui-page-header/ui-page-header';

@Component({
  selector: 'app-demo-dialog',
  standalone: true,
  imports: [UiPageHeader, UiCard, UiButton, DialogModule],
  templateUrl: './demo-dialog.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: { class: 'flex flex-col gap-4' },
})
export class DemoDialogPage {
  private dialog = inject(Dialog);
  lastAction = signal('None');

  openConfirmDelete() {
    const data: UiDialogConfirmData = {
      title: 'Delete Item?',
      message: 'Are you sure you want to delete this item? This action cannot be undone.',
      confirmLabel: 'Delete',
      variant: 'danger',
    };

    const ref = this.dialog.open<boolean>(UiDialogConfirm, {
      data,
      width: '400px',
    });

    ref.closed.subscribe((result) => {
      this.lastAction.set(result ? 'Deleted' : 'Cancelled delete');
    });
  }

  openConfirmSave() {
    const data: UiDialogConfirmData = {
      title: 'Save Changes?',
      message: 'Do you want to save your current progress?',
      confirmLabel: 'Save',
      variant: 'primary',
    };

    const ref = this.dialog.open<boolean>(UiDialogConfirm, {
      data,
      width: '400px',
    });

    ref.closed.subscribe((result) => {
      this.lastAction.set(result ? 'Saved' : 'Cancelled save');
    });
  }

  openCustom() {
    this.dialog.open(CustomDialogExample, {
      width: '500px',
    });
  }

  // Playground Config
  configTitle = signal('Confirm Action');
  configMessage = signal('Are you sure you want to proceed?');
  configConfirmLabel = signal('Confirm');
  configVariant = signal<'primary' | 'danger' | 'warning'>('primary');

  openPlaygroundConfirm() {
    this.dialog.open(UiDialogConfirm, {
      data: {
        title: this.configTitle(),
        message: this.configMessage(),
        confirmLabel: this.configConfirmLabel(),
        variant: this.configVariant(),
      } as UiDialogConfirmData,
      width: '400px',
    });
  }
}

@Component({
  standalone: true,
  imports: [UiDialog, UiButton],
  template: `
    <ui-dialog title="Custom Dialog" (closeAction)="close()">
      <div class="">
        <p>This is a custom dialog content wrapped in <code>ui-dialog</code>.</p>
        <div class="flex justify-end gap-2">
          <button uiButton variant="secondary" (click)="close()">Close</button>
        </div>
      </div>
    </ui-dialog>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: { class: 'flex flex-col gap-4' },
})
class CustomDialogExample {
  private dialogRef = inject(Dialog);

  close() {
    this.dialogRef.closeAll();
  }
}
