import { HttpClient, httpResource } from '@angular/common/http';
import { inject } from '@angular/core';
import { ApiResponse } from '../../shared/interfaces/api-response.interface';

export abstract class BaseService<T> {
  protected http = inject(HttpClient);
  protected abstract apiUrl: string;

  getAll() {
    return httpResource<ApiResponse<T[]>>(() => this.apiUrl);
  }

  getById(id: string | number) {
    return httpResource<ApiResponse<T>>(() => `${this.apiUrl}/${id}`);
  }

  create(entity: T) {
    return this.http.post<ApiResponse<T>>(this.apiUrl, entity);
  }

  update(id: string | number, entity: T) {
    return this.http.put<ApiResponse<T>>(`${this.apiUrl}/${id}`, entity);
  }

  delete(id: string | number) {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }
}
