import { HttpClient, httpResource } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { DocumentStatus } from '../../shared/interfaces/constants';

@Injectable({ providedIn: 'root' })
export abstract class BaseDocumentService<T, TCreate = Partial<T>, TUpdate = Partial<T>> {
  protected http = inject(HttpClient);
  protected abstract apiUrl: string;

  getAll() {
    return httpResource<T[]>(() => {
      return this.apiUrl;
    });
  }

  getById(id: () => string | number | undefined | null) {
    return httpResource<T>(() => {
      const actualId = typeof id === 'function' ? id() : id;
      if (!actualId) return undefined;

      return `${this.apiUrl}/${actualId}`;
    });
  }

  create(entity: TCreate) {
    return this.http.post<T>(this.apiUrl, entity);
  }

  update(id: string | number, entity: TUpdate) {
    return this.http.patch<T>(`${this.apiUrl}/${id}`, entity);
  }

  updateStatus(id: string, status: DocumentStatus) {
    return this.http.patch<T>(`${this.apiUrl}/${id}/status`, { status });
  }

  delete(id: string | number) {
    return this.http.delete<void>(this.apiUrl, { body: { id } }); // Wait, delete usually takes id in path but based on existing code:
  }

  getSummary() {
    return httpResource<{
      totalAmount: number;
      totalCount: number;
      completedCount: number;
    }>(() => {
      return `${this.apiUrl}/summary`;
    });
  }
}
