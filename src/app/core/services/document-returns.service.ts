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

  addItems(id: string, items: CreateDocumentReturnItemInput[]) {
    return this.http.post<DocumentReturn>(`${this.apiUrl}/${id}/items`, { items });
  }

  updateItem(id: string, itemId: string, item: CreateDocumentReturnItemInput) {
    return this.http.patch<DocumentReturn>(`${this.apiUrl}/${id}/items/${itemId}`, item);
  }

  removeItems(id: string, itemIds: string[]) {
    return this.http.delete<DocumentReturn>(`${this.apiUrl}/${id}/items`, { body: { itemIds } });
  }
}
