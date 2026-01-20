import { Dialog } from '@angular/cdk/dialog';
import { DecimalPipe } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  computed,
  DestroyRef,
  inject,
  signal,
} from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { form, FormField } from '@angular/forms/signals';
import { filter, switchMap, tap } from 'rxjs';
import { ClientsService } from '../../../../../core/services/clients.service';
import { UiButton } from '../../../../../core/ui/ui-button/ui-button';
import { UiCard } from '../../../../../core/ui/ui-card/ui-card';
import { UiDialogConfirm } from '../../../../../core/ui/ui-dialog-confirm/ui-dialog-confirm';
import { UiDialogConfirmData } from '../../../../../core/ui/ui-dialog-confirm/ui-dialog-confirm-data.interface';
import { IconName } from '../../../../../core/ui/ui-icon/data';
import { UiIcon } from '../../../../../core/ui/ui-icon/ui-icon.component';
import { UiInput } from '../../../../../core/ui/ui-input/ui-input';
import { UiLoading } from '../../../../../core/ui/ui-loading/ui-loading';
import { TableColumn } from '../../../../../core/ui/ui-table/table-column.interface';
import { UiTable } from '../../../../../core/ui/ui-table/ui-table';
import {
  ClientDialogData,
  ClientDialogResult,
} from '../../../../../shared/interfaces/dialogs/client-dialog.interface';
import { Client } from '../../../../../shared/interfaces/entities/client.interface';
import { ClientDialog } from './client-dialog/client-dialog';

@Component({
  selector: 'app-clients-page',
  imports: [UiButton, UiCard, UiIcon, UiLoading, UiTable, DecimalPipe, UiInput, FormField],
  templateUrl: './clients-page.html',
  styleUrl: './clients-page.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: {
    class: 'flex flex-col gap-4',
  },
})
export class ClientsPage {
  private clientsService = inject(ClientsService);
  private dialog = inject(Dialog);
  private destroyRef = inject(DestroyRef);

  // State
  selectedClient = signal<Client | undefined>(undefined);

  searchForm = form(signal({ query: '' }));

  // Resources
  clients = this.clientsService.getAll({ includes: ['sales'] });

  stats = computed(() => {
    const list = this.clients.value() || [];
    const totalPurchases = list.reduce((sum, client) => {
      const salesTotal = client.sales?.reduce((s, sale) => s + (sale.total || 0), 0) || 0;
      return sum + salesTotal;
    }, 0);

    return [
      {
        label: 'Всего клиентов',
        value: list.length,
        icon: 'outline-users' as IconName,
        color: 'bg-emerald-50 text-emerald-600',
      },
      {
        label: 'Активных клиентов',
        value: list.filter((c) => c.isActive).length,
        icon: 'outline-users' as IconName,
        color: 'bg-emerald-50 text-emerald-600',
      },
      {
        label: 'Общая выручка',
        value: totalPurchases,
        icon: 'outline-users' as IconName, // Using users as placeholder if currency icon is missing
        color: 'bg-emerald-50 text-emerald-600',
      },
    ];
  });

  columns: TableColumn<Client>[] = [
    {
      key: 'id',
      header: 'Код',
      type: 'id',
      width: '120px',
    },
    {
      key: 'name',
      header: 'Имя клиента',
      type: 'template',
      templateName: 'name',
    },
    {
      key: 'phone',
      header: 'Телефон',
      type: 'text',
      icon: 'outline-phone',
      valueGetter: (row) => row.phone || '-',
      width: '160px',
    },
    {
      key: 'address',
      header: 'Местоположение',
      type: 'text',
      icon: 'outline-map-pin',
      valueGetter: (row) => row.address || '-',
      width: '200px',
    },
    {
      key: 'isActive',
      header: 'Статус',
      type: 'badge',
      badgeVariants: {
        true: 'success',
        false: 'neutral',
      },
      badgeLabels: {
        true: 'Активен',
        false: 'Неактивен',
      },
      width: '120px',
    },
    {
      key: 'actions',
      header: 'Actions',
      type: 'template',
      templateName: 'actions',
      width: '140px',
      align: 'right',
    },
  ];

  filteredClients = computed(() => {
    const clients = this.clients.value() || [];
    const query = this.searchForm().value().query.toLowerCase();

    if (!query) {
      return clients;
    }

    return clients.filter(
      (c) =>
        c.name.toLowerCase().includes(query) ||
        c.email?.toLowerCase().includes(query) ||
        c.phone?.toLowerCase().includes(query) ||
        c.address?.toLowerCase().includes(query),
    );
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
          message: `Вы действительно хотите удалить клиента "${client.name}"? Это действие нельзя отменить.`,
          variant: 'danger',
          confirmLabel: 'Удалить',
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
