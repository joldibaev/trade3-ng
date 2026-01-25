import { CurrencyPipe, DatePipe, DecimalPipe } from '@angular/common';
import { ChangeDetectionStrategy, Component, computed, input } from '@angular/core';
import { LookupPipe } from '../../../../../../../core/pipes/lookup-pipe';
import { UiIcon } from '../../../../../../../core/ui/ui-icon/ui-icon.component';
import { DocumentLedger } from '../../../../../../../shared/interfaces/entities/document-ledger.interface';
import { DocumentHistoryEntry } from './document-history-entry/document-history-entry';

interface ChangeDetail {
  label: string;
  value?: string | number;
  from?: string | number;
  to?: string | number;
  isCurrency?: boolean;
}

interface ViewModel {
  id: string;
  action: string;
  createdAt: string;
  userId: string;
  productName?: string;
  details: Record<string, unknown>;
  changes?: ChangeDetail[];
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
  imports: [UiIcon, DatePipe, CurrencyPipe, DecimalPipe, DocumentHistoryEntry, LookupPipe],
  templateUrl: './document-history.html',
  styleUrl: './document-history.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DocumentHistory {
  readonly STATUS_MAP = STATUS_MAP;

  data = input.required<DocumentLedger[]>();
  productMap = input<Record<string, string>>({});

  viewModels = computed(() => {
    const list = this.data() || [];
    const productMap = this.productMap();

    return list.map((item) => {
      const details = (item.details || {}) as Record<string, unknown>;
      const productName = this.resolveProductName(details, productMap);
      return this.mapToViewModel(item, productName, details);
    });
  });

  private resolveProductName(
    details: Record<string, unknown>,
    productMap: Record<string, string>,
  ): string {
    const id = (details['productId'] ||
      details['id'] ||
      (details['product'] as Record<string, unknown>)?.['id']) as string | undefined;

    return (
      (details['productName'] as string) ||
      ((details['product'] as Record<string, unknown>)?.['name'] as string) ||
      (id ? productMap[id] : null) ||
      'Товар'
    );
  }

  private mapToViewModel(
    item: DocumentLedger,
    productName: string,
    details: Record<string, unknown>,
  ): ViewModel {
    const base = {
      id: item.id,
      action: item.action,
      createdAt: item.createdAt,
      userId: 'Система',
      productName,
      details,
    };

    if (item.action === 'ITEM_CHANGED') {
      return { ...base, changes: this.mapItemChanges(details['changes']) };
    }

    if (item.action === 'UPDATED') {
      return {
        ...base,
        changes: Object.entries(details).map(([key, value]) => ({
          label: FIELD_MAP[key] || key,
          value: value as string | number,
          isCurrency: key === 'total' || key.toLowerCase().includes('price'),
        })),
      };
    }

    return base;
  }

  private mapItemChanges(changes: unknown): ChangeDetail[] {
    if (!changes || typeof changes !== 'object') return [];
    const c = changes as Record<string, { from: string | number; to: string | number }>;
    const result: ChangeDetail[] = [];

    if (c['quantity']) {
      result.push({
        label: 'кол-во',
        from: c['quantity'].from,
        to: c['quantity'].to,
      });
    }

    if (c['price']) {
      result.push({
        label: 'цена',
        from: c['price'].from,
        to: c['price'].to,
        isCurrency: true,
      });
    }

    return result;
  }
}
