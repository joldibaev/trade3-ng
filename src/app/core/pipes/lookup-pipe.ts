import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'lookup',
})
export class LookupPipe implements PipeTransform {
  transform<T>(key: unknown, map: Record<string, T> | null | undefined): T | undefined {
    if (key === null || key === undefined || !map) {
      return undefined;
    }
    return map[String(key)];
  }
}
