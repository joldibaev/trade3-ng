import { Dialog } from '@angular/cdk/dialog';
import { ChangeDetectionStrategy, Component, computed, inject, signal } from '@angular/core';
import { Field, form } from '@angular/forms/signals';
import { filter, switchMap, tap } from 'rxjs';
import { ClientsService } from '../../../../../core/services/clients.service';
import { UiButton } from '../../../../../core/ui/ui-button/ui-button';
import { UiDialogConfirm } from '../../../../../core/ui/ui-dialog-confirm/ui-dialog-confirm';
import { UiDialogConfirmData } from '../../../../../core/ui/ui-dialog-confirm/ui-dialog-confirm-data.interface';
import { UiInput } from '../../../../../core/ui/ui-input/ui-input';
import { TableColumn } from '../../../../../core/ui/ui-table/table-column.interface';
import { UiTable } from '../../../../../core/ui/ui-table/ui-table';
import { Client } from '../../../../../shared/interfaces/entities/client.interface';
import { ClientDialog } from './client-dialog/client-dialog';
import { ClientDialogData } from './client-dialog/client-dialog-data.interface';
import { ClientDialogResult } from './client-dialog/client-dialog-result.interface';

@Component({
  selector: 'app-clients-page',
  imports: [UiButton, UiInput, UiTable, Field],
  templateUrl: './clients-page.html',
  styleUrl: './clients-page.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: {
    class: 'flex flex-col gap-4 h-full',
  },
})
export class ClientsPage {
  private clientsService = inject(ClientsService);
  private dialog = inject(Dialog);

  // State
  selectedClient = signal<Client | undefined>(undefined);
  searchForm = form(signal({ query: '' }));
  isSearchVisible = signal(false);

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
    const query = this.searchForm().value().query.toLowerCase();

    if (!query) {
      return clients;
    }

    return clients.filter((c) => c.name.toLowerCase().includes(query));
  });

  selectClient(client?: Client) {
    this.selectedClient.set(client);
  }

  // Helper methods for template
  editCurrentClient() {
    const client = this.selectedClient();
    if (!client) return;
    this.openClientDialog(client);
  }

  deleteCurrentClient() {
    const client = this.selectedClient();
    if (!client) return;
    this.deleteClient(client);
  }

  // CRUD
  openClientDialog(client?: Client) {
    const data: ClientDialogData = { client };

    this.dialog
      .open<ClientDialogResult>(ClientDialog, { data, width: '400px' })
      .closed.pipe(
        filter(Boolean),
        switchMap((result) => {
          if (client) {
            return this.clientsService.update(client.id, result);
          }
          return this.clientsService.create(result as unknown as Client);
        }),
        tap(() => this.clients.reload()),
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
      )
      .subscribe();
  }
}
