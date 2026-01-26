import { Injectable } from '@angular/core';
import {
  CreateDocumentReturnDto,
  CreateDocumentReturnItemInput,
} from '../../shared/interfaces/dtos/document-return/create-document-return.interface';
import { DocumentReturn } from '../../shared/interfaces/entities/document-return.interface';
import { BaseDocumentService } from './base-document.service';

@Injectable({ providedIn: 'root' })
export class DocumentReturnsService extends BaseDocumentService<
  DocumentReturn,
  CreateDocumentReturnDto,
  CreateDocumentReturnDto
> {
  protected apiUrl = '/api/document-returns';

  addItem(id: string, item: CreateDocumentReturnItemInput) {
    return this.http.post<DocumentReturn>(`${this.apiUrl}/${id}/items`, item);
  }

  updateItem(id: string, itemId: string, item: CreateDocumentReturnItemInput) {
    return this.http.patch<DocumentReturn>(`${this.apiUrl}/${id}/items/${itemId}`, item);
  }

  removeItem(id: string, itemId: string) {
    return this.http.delete<void>(`${this.apiUrl}/${id}/items/${itemId}`);
  }
}
