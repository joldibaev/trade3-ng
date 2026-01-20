import { DatePipe } from '@angular/common';
import { ChangeDetectionStrategy, Component, computed, input } from '@angular/core';
import { UiCard } from '../../../core/ui/ui-card/ui-card';
import { IconName } from '../../../core/ui/ui-icon/data';
import { UiIcon } from '../../../core/ui/ui-icon/ui-icon.component';
import { DocumentHistory } from '../../interfaces/entities/document-history.interface';

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
  product_id?: string;
  id?: string;
  product?: { id?: string; name?: string };
  productName?: string;
  quantity?: number;
  [key: string]: unknown;
}

interface UpdateDetails {
  notes?: string;
  [key: string]: unknown;
}

interface ViewModel {
  id: string;
  action: string;
  createdAt?: string;
  userId?: string; // Add these to avoid needing original item in loop
  title: string;
  icon: IconName;
  iconColor: string;
  bgColor: string;
}

@Component({
  selector: 'app-document-history',
  standalone: true,
  imports: [UiCard, UiIcon, DatePipe],
  templateUrl: './document-history.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DocumentHistoryComponent {
  history = input<DocumentHistory[] | undefined>([]);
  productMap = input<Record<string, string>>({});

  // Computed map of history ID -> Resolved Product Name
  // This satisfies the request to make formatProductName "computed"
  resolvedProductNames = computed(() => {
    const history = this.history() || [];
    const map = this.productMap();
    const result: Record<string, string> = {};

    history.forEach((item) => {
      const details = (item.details || {}) as ItemDetails;
      const id = details?.productId || details?.product_id || details?.id || details?.product?.id;
      const mappedName = id ? map[id] : undefined;
      result[item.id] = details?.productName || details?.product?.name || mappedName || 'Товар';
    });

    return result;
  });

  viewModels = computed(() => {
    const list = this.history();
    const names = this.resolvedProductNames(); // Dependency on names
    if (!list) return [];
    return list.map((item) => this.mapToViewModel(item, names[item.id]));
  });

  private mapToViewModel(item: DocumentHistory, productName: string): ViewModel {
    const details = (item.details || {}) as unknown;
    const base = {
      id: item.id,
      action: item.action,
      createdAt: item.createdAt,
      userId: item.userId,
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
        const d = details as UpdateDetails;
        let title = 'Заказ обновлен';
        if (d.notes)
          title = `Обновлено примечание: <span class="text-slate-700 italic">"${d.notes}"</span>`;
        return {
          ...base,
          title,
          icon: 'outline-pencil',
          iconColor: 'text-orange-500',
          bgColor: 'bg-orange-50',
        };
      }

      case 'STATUS_CHANGED': {
        const d = details as StatusDetails;
        if (d.to === 'COMPLETED') {
          return {
            ...base,
            title: 'Заказ проведен',
            icon: 'outline-check',
            iconColor: 'text-green-600',
            bgColor: 'bg-green-100',
          };
        } else if (d.to === 'DRAFT') {
          return {
            ...base,
            title: 'Проведение отменено',
            icon: 'outline-arrow-left',
            iconColor: 'text-red-600',
            bgColor: 'bg-red-100',
          };
        } else {
          return {
            ...base,
            title: 'Статус изменен',
            icon: 'outline-info-circle',
            iconColor: 'text-blue-500',
            bgColor: 'bg-blue-50',
          };
        }
      }

      case 'ITEM_ADDED': {
        const d = details as ItemDetails;
        let addedDesc = `<b>${productName}</b>`;
        if (d.quantity) addedDesc += ` — ${d.quantity} шт.`;
        return {
          ...base,
          title: `Добавлен товар: ${addedDesc}`,
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
        const d = details as ItemChangeDetails;
        let title = '';

        if (d.changes?.quantity) {
          const from = `<span class="text-red-600 line-through">${d.changes.quantity.from}</span>`;
          const to = `<span class="text-green-600 font-medium">${d.changes.quantity.to}</span>`;
          title = `Изменено количество для <b>${productName}</b>: ${from} → ${to}`;
        } else if (d.changes?.price) {
          const from = `<span class="text-red-600">${d.changes.price.from}</span>`;
          const to = `<span class="text-green-600 font-medium">${d.changes.price.to}</span>`;
          title = `Изменена цена для <b>${productName}</b>: ${from} → ${to}`;
        } else {
          title = `Товар изменен: <b>${productName}</b>`;
        }

        return {
          ...base,
          title,
          icon: 'outline-edit',
          iconColor: 'text-orange-500',
          bgColor: 'bg-orange-50',
        };
      }

      default:
        return {
          ...base,
          title: item.action,
          icon: 'outline-info-circle',
          iconColor: 'text-blue-500',
          bgColor: 'bg-blue-50',
        };
    }
  }
}
