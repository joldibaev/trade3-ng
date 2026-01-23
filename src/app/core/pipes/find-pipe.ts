import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'find',
})
export class FindPipe implements PipeTransform {
  transform<T>(items: T[] | null | undefined, key: keyof T, value: T[keyof T]): T | undefined {
    if (!items || !key) {
      return undefined;
    }
    return items.find((item) => item[key] === value);
  }
}
