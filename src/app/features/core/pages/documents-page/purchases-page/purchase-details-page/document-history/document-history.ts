import { CurrencyPipe, DatePipe, DecimalPipe } from '@angular/common';
import { ChangeDetectionStrategy, Component, computed, inject, input } from '@angular/core';
import { UiCard } from '../../../../../../../core/ui/ui-card/ui-card';
import { IconName } from '../../../../../../../core/ui/ui-icon/data';
import { UiIcon } from '../../../../../../../core/ui/ui-icon/ui-icon.component';
import { DocumentLedger } from '../../../../../../../shared/interfaces/entities/document-ledger.interface';

interface StatusDetails {
  from?: string;
  to: string;
}

interface ItemChangeDetails {
  productId?: string;
  changes?: {
    quantity?: { from: number | string; to: number | string };
    price?: { from: number | string; to: number | string };
  };
}

interface ItemDetails {
  productId?: string;
  id?: string;
  product?: { id?: string; name?: string };
  productName?: string;
  quantity?: number;
  [key: string]: unknown;
}

interface ViewModel {
  id: string;
  action: string;
  createdAt?: string;
  userId?: string;
  title: string;
  details?: string;
  icon: IconName;
  iconColor: string;
  bgColor: string;
}

const STATUS_MAP: Record<string, { label: string; color: string }> = {
  DRAFT: { label: 'Черновик', color: 'text-slate-500' },
  COMPLETED: { label: 'Проведен', color: 'text-green-600' },
  CANCELLED: { label: 'Отменен', color: 'text-red-600' },
  SCHEDULED: { label: 'Запланирован', color: 'text-blue-600' },
};

const FIELD_MAP: Record<string, string> = {
  notes: 'Примечание',
  storeId: 'Склад',
  vendorId: 'Поставщик',
  clientId: 'Клиент',
  date: 'Дата документа',
  total: 'Итоговая сумма',
  priceTypeId: 'Тип цены',
  cashboxId: 'Касса',
};

@Component({
  selector: 'app-document-history',
  standalone: true,
  imports: [UiCard, UiIcon, DatePipe],
  templateUrl: './document-history.html',
  styleUrl: './document-history.css',
  providers: [CurrencyPipe, DecimalPipe],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DocumentHistory {
  private currencyPipe = inject(CurrencyPipe);
  private decimalPipe = inject(DecimalPipe);

  data = input.required<DocumentLedger[]>();
  productMap = input<Record<string, string>>({});

  private formatValue(value: string | number, key: string): string {
    if (typeof value !== 'number' && isNaN(Number(value))) return `"${value}"`;
    const num = Number(value);

    if (
      key.toLowerCase().includes('price') ||
      key === 'total' ||
      key.toLowerCase().includes('value')
    ) {
      return this.currencyPipe.transform(num, 'KZT', 'symbol-narrow', '1.0-2') || `${num}`;
    }
    return this.decimalPipe.transform(num, '1.0-3') || `${num}`;
  }

  resolvedProductNames = computed(() => {
    const list = this.data() || [];
    const map = this.productMap();
    const result: Record<string, string> = {};

    list.forEach((item) => {
      const details = (item.details || {}) as ItemDetails;
      const id = details?.productId || details?.id || details?.product?.id;
      const mappedName = id ? map[id] : undefined;
      result[item.id] = details?.productName || details?.product?.name || mappedName || 'Товар';
    });

    return result;
  });

  viewModels = computed(() => {
    const list = this.data();
    const names = this.resolvedProductNames();
    if (!list) return [];
    return list.map((item) => this.mapToViewModel(item, names[item.id]));
  });

  private mapToViewModel(item: DocumentLedger, productName: string): ViewModel {
    const details = (item.details || {}) as Record<string, unknown>;
    const base = {
      id: item.id,
      action: item.action,
      createdAt: item.createdAt,
      userId: 'Система', // Backend currently doesn't provide userId in Ledger, using placeholder
    };

    switch (item.action) {
      case 'CREATED':
        return {
          ...base,
          title: 'Заказ создан',
          icon: 'outline-box',
          iconColor: 'text-green-600',
          bgColor: 'bg-green-100',
        };

      case 'UPDATED': {
        const changes = Object.entries(details)
          .map(([key, value]) => {
            const label = FIELD_MAP[key] || key;
            if (key === 'date')
              return `${label}: <i>${new Date(value as string).toLocaleDateString()}</i>`;
            return `${label}: <i>${this.formatValue(value as string | number, key)}</i>`;
          })
          .join(', ');

        return {
          ...base,
          title: `Заказ обновлен`,
          details: changes,
          icon: 'outline-pencil',
          iconColor: 'text-orange-500',
          bgColor: 'bg-orange-50',
        };
      }

      case 'STATUS_CHANGED': {
        const d = details as unknown as StatusDetails;
        const from = STATUS_MAP[d.from as string] || { label: d.from, color: '' };
        const to = STATUS_MAP[d.to as string] || { label: d.to, color: '' };

        return {
          ...base,
          title: `Статус изменен: <span class="${from.color}">${from.label}</span> → <span class="font-medium ${to.color}">${to.label}</span>`,
          icon: 'outline-refresh',
          iconColor: 'text-blue-500',
          bgColor: 'bg-blue-50',
        };
      }

      case 'ITEM_ADDED': {
        const d = details as Record<string, unknown>;
        const qty = d['quantity'] ? ` — <b>${d['quantity']} шт.</b>` : '';
        return {
          ...base,
          title: `Добавлен товар: <b>${productName}</b>${qty}`,
          icon: 'outline-plus',
          iconColor: 'text-blue-600',
          bgColor: 'bg-blue-100',
        };
      }

      case 'ITEM_REMOVED': {
        return {
          ...base,
          title: `Удален товар: <b>${productName}</b>`,
          icon: 'outline-trash',
          iconColor: 'text-red-600',
          bgColor: 'bg-red-100',
        };
      }

      case 'ITEM_CHANGED': {
        const entry = details as ItemChangeDetails;
        const changeParts: string[] = [];

        if (entry.changes?.quantity) {
          const from = `<span class="text-slate-400 line-through">${this.formatValue(entry.changes.quantity.from, 'quantity')}</span>`;
          const to = `<span class="text-green-600 font-medium">${this.formatValue(entry.changes.quantity.to, 'quantity')}</span>`;
          changeParts.push(`кол-во: ${from} → ${to}`);
        }

        if (entry.changes?.price) {
          const from = `<span class="text-slate-400 line-through">${this.formatValue(entry.changes.price.from, 'price')}</span>`;
          const to = `<span class="text-green-600 font-medium">${this.formatValue(entry.changes.price.to, 'price')}</span>`;
          changeParts.push(`цена: ${from} → ${to}`);
        }

        return {
          ...base,
          title: `Изменен товар: <b>${productName}</b>`,
          details: changeParts.join(', '),
          icon: 'outline-edit',
          iconColor: 'text-orange-500',
          bgColor: 'bg-orange-50',
        };
      }

      case 'DELETED':
        return {
          ...base,
          title: 'Заказ удален',
          icon: 'outline-trash',
          iconColor: 'text-red-600',
          bgColor: 'bg-red-100',
        };

      default:
        return {
          ...base,
          title: `Операция: ${item.action}`,
          details: JSON.stringify(details),
          icon: 'outline-info-circle',
          iconColor: 'text-blue-500',
          bgColor: 'bg-blue-50',
        };
    }
  }
}
