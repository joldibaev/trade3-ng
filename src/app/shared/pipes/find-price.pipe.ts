import { Pipe, PipeTransform } from '@angular/core';

interface PriceItem {
  priceTypeId: string;
  value: number;
}

@Pipe({
  name: 'findPrice',
})
export class FindPricePipe implements PipeTransform {
  transform(prices: PriceItem[] | undefined | null, typeId: string): number {
    if (!prices) return 0;
    return prices.find((p) => p.priceTypeId === typeId)?.value || 0;
  }
}
