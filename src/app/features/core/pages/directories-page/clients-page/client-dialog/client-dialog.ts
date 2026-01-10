import { DIALOG_DATA, DialogRef } from '@angular/cdk/dialog';
import {
  ChangeDetectionStrategy,
  Component,
  computed,
  DestroyRef,
  inject,
  signal,
} from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { FormsModule } from '@angular/forms';
import { form, FormField, required } from '@angular/forms/signals';
import { finalize } from 'rxjs';
import { ClientsService } from '../../../../../../core/services/clients.service';
import { UiButton } from '../../../../../../core/ui/ui-button/ui-button';
import { UiDialog } from '../../../../../../core/ui/ui-dialog/ui-dialog';
import { UiInput } from '../../../../../../core/ui/ui-input/ui-input';
import {
  ClientDialogData,
  ClientDialogResult,
} from '../../../../../../shared/interfaces/dialogs/client-dialog.interface';
import { Client } from '../../../../../../shared/interfaces/entities/client.interface';

@Component({
  selector: 'app-client-dialog',
  imports: [UiInput, UiButton, UiDialog, FormField, FormsModule],
  templateUrl: './client-dialog.html',
  styleUrl: './client-dialog.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ClientDialog {
  private dialogRef = inject<DialogRef<Client>>(DialogRef);
  private data = inject<ClientDialogData>(DIALOG_DATA);

  formState = signal<ClientDialogResult>({
    name: this.data.client?.name ?? '',
    phone: this.data.client?.phone ?? '',
    email: this.data.client?.email ?? '',
    address: this.data.client?.address ?? '',
  });
  formData = form(this.formState, (schemaPath) => {
    required(schemaPath.name, { message: 'Наименование обязательно' });
  });

  private clientsService = inject(ClientsService);
  private destroyRef = inject(DestroyRef);
  loading = signal(false);

  isEdit = computed(() => Boolean(this.data?.client));

  close() {
    this.dialogRef.close();
  }

  save() {
    if (!this.formData().valid()) return;

    this.loading.set(true);
    const value = this.formData().value();

    const request$ = this.isEdit()
      ? this.clientsService.update(this.data.client!.id, value)
      : this.clientsService.create(value);

    request$
      .pipe(
        finalize(() => this.loading.set(false)),
        takeUntilDestroyed(this.destroyRef),
      )
      .subscribe((result) => {
        this.dialogRef.close(result);
      });
  }
}
