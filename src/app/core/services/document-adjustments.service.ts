import { Injectable } from '@angular/core';
import {
  CreateDocumentAdjustmentDto,
  CreateDocumentAdjustmentItemInput,
} from '../../shared/interfaces/dtos/document-adjustment/create-document-adjustment.interface';
import { DocumentAdjustment } from '../../shared/interfaces/entities/document-adjustment.interface';
import { BaseDocumentService } from './base-document.service';

@Injectable({ providedIn: 'root' })
export class DocumentAdjustmentsService extends BaseDocumentService<
  DocumentAdjustment,
  CreateDocumentAdjustmentDto,
  CreateDocumentAdjustmentDto
> {
  protected apiUrl = '/api/document-adjustments';

  addItem(id: string, item: CreateDocumentAdjustmentItemInput) {
    return this.http.post<DocumentAdjustment>(`${this.apiUrl}/${id}/items`, item);
  }

  updateItem(id: string, itemId: string, item: CreateDocumentAdjustmentItemInput) {
    return this.http.patch<DocumentAdjustment>(`${this.apiUrl}/${id}/items/${itemId}`, item);
  }

  removeItem(id: string, itemId: string) {
    return this.http.delete<void>(`${this.apiUrl}/${id}/items/${itemId}`);
  }
}
