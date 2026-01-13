import { Dialog } from '@angular/cdk/dialog';
import {
  ChangeDetectionStrategy,
  Component,
  computed,
  DestroyRef,
  inject,
  signal,
} from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { filter, switchMap, tap } from 'rxjs';
import { ClientsService } from '../../../../../core/services/clients.service';
import { UiDialogConfirm } from '../../../../../core/ui/ui-dialog-confirm/ui-dialog-confirm';
import { UiDialogConfirmData } from '../../../../../core/ui/ui-dialog-confirm/ui-dialog-confirm-data.interface';
import { TableColumn } from '../../../../../core/ui/ui-table/table-column.interface';
import {
  ClientDialogData,
  ClientDialogResult,
} from '../../../../../shared/interfaces/dialogs/client-dialog.interface';
import { Client } from '../../../../../shared/interfaces/entities/client.interface';
import { TableStruct } from '../../../components/table-struct/table-struct';
import { ClientDialog } from './client-dialog/client-dialog';

@Component({
  selector: 'app-clients-page',
  imports: [TableStruct],
  templateUrl: './clients-page.html',
  styleUrl: './clients-page.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ClientsPage {
  private clientsService = inject(ClientsService);
  private dialog = inject(Dialog);
  private destroyRef = inject(DestroyRef);

  // State
  selectedClient = signal<Client | undefined>(undefined);
  searchQuery = signal('');

  // Resources
  clients = this.clientsService.getAll();

  columns: TableColumn<Client>[] = [
    {
      key: 'id',
      header: 'Код',
      valueGetter: (_, index) => `000${index + 1}`,
      width: '80px',
    },
    {
      key: 'name',
      header: 'Наименование',
    },
    {
      key: 'phone',
      header: 'Телефон',
      valueGetter: (row) => row.phone || '-',
    },
    {
      key: 'email',
      header: 'Email',
      valueGetter: (row) => row.email || '-',
    },
    {
      key: 'address',
      header: 'Адрес',
      valueGetter: (row) => row.address || '-',
    },
  ];

  filteredClients = computed(() => {
    const clients = this.clients.value() || [];
    const query = this.searchQuery().toLowerCase();

    if (!query) {
      return clients;
    }

    return clients.filter((c) => c.name.toLowerCase().includes(query));
  });

  // CRUD
  openClientDialog(client?: Client) {
    const data: ClientDialogData = { client };

    this.dialog
      .open<ClientDialogResult>(ClientDialog, { data, width: '400px' })
      .closed.pipe(
        filter(Boolean),
        tap(() => this.clients.reload()),
        takeUntilDestroyed(this.destroyRef),
      )
      .subscribe();
  }

  deleteClient(client: Client) {
    this.dialog
      .open<boolean, UiDialogConfirmData>(UiDialogConfirm, {
        data: {
          title: 'Удалить клиента?',
          message: `Вы действительно хотите удалить клиента "${client.name}"?`,
          variant: 'danger',
        },
        width: '400px',
      })
      .closed.pipe(
        filter(Boolean),
        switchMap(() => this.clientsService.delete(client.id)),
        tap(() => {
          this.clients.reload();
          if (this.selectedClient()?.id === client.id) {
            this.selectedClient.set(undefined);
          }
        }),
        takeUntilDestroyed(this.destroyRef),
      )
      .subscribe();
  }
}
