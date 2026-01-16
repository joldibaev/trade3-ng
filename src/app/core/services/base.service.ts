import { HttpClient, httpResource } from '@angular/common/http';
import { inject } from '@angular/core';

// Helper type to exclude primitive properties and keep only object/array relations
export type RelationKeys<T> = {
  [K in keyof T]: T[K] extends string | number | boolean | Date | undefined | null ? never : K;
}[keyof T] &
  string;

export abstract class BaseService<T, TIncludes extends string = RelationKeys<T>> {
  protected http = inject(HttpClient);
  protected abstract apiUrl: string;

  getAll(options?: {
    includes?: TIncludes[];
    params?:
      | Record<string, string | number | boolean>
      | (() => Record<string, string | number | boolean | undefined | null>);
  }) {
    return httpResource<T[]>(() => {
      let url = this.apiUrl;
      const queryParams: string[] = [];

      if (options?.includes && options.includes.length > 0) {
        options.includes.forEach((inc) => queryParams.push(`include=${inc}`));
      }

      const params = typeof options?.params === 'function' ? options.params() : options?.params;

      if (params) {
        Object.entries(params).forEach(([key, value]) => {
          if (value !== undefined && value !== null) {
            queryParams.push(`${key}=${encodeURIComponent(value)}`);
          }
        });
      }

      if (queryParams.length > 0) {
        url += `?${queryParams.join('&')}`;
      }

      return url;
    });
  }

  getById(id: () => string | number | undefined | null) {
    return httpResource<T>(() => {
      const actualId = typeof id === 'function' ? id() : id;
      if (!actualId) return undefined;
      return `${this.apiUrl}/${actualId}`;
    });
  }

  create(entity: Partial<T>) {
    return this.http.post<T>(this.apiUrl, entity);
  }

  update(id: string | number, entity: Partial<T>) {
    return this.http.patch<T>(`${this.apiUrl}/${id}`, entity);
  }

  delete(id: string | number) {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }

  fetchById(id: string | number, includes?: TIncludes[]) {
    let url = `${this.apiUrl}/${id}`;
    if (includes && includes.length > 0) {
      const params = includes.map((inc) => `include=${inc}`).join('&');
      url += `?${params}`;
    }
    return this.http.get<T>(url);
  }
}
