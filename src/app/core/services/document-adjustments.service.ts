import { Injectable } from '@angular/core';
import { CreateDocumentAdjustmentItemDto } from '../../shared/interfaces/dtos/document-adjustment/create-document-adjustment-item.interface';
import { CreateDocumentAdjustmentDto } from '../../shared/interfaces/dtos/document-adjustment/create-document-adjustment.interface';
import { DocumentAdjustment } from '../../shared/interfaces/entities/document-adjustment.interface';
import { BaseDocumentService } from './base-document.service';

@Injectable({ providedIn: 'root' })
export class DocumentAdjustmentsService extends BaseDocumentService<
  DocumentAdjustment,
  CreateDocumentAdjustmentDto,
  CreateDocumentAdjustmentDto
> {
  protected apiUrl = '/api/document-adjustments';

  addItems(id: string, items: CreateDocumentAdjustmentItemDto[]) {
    return this.http.post<DocumentAdjustment>(`${this.apiUrl}/${id}/items`, { items });
  }

  updateItem(id: string, itemId: string, item: CreateDocumentAdjustmentItemDto) {
    return this.http.patch<DocumentAdjustment>(`${this.apiUrl}/${id}/items/${itemId}`, item);
  }

  removeItems(id: string, itemIds: string[]) {
    return this.http.delete<DocumentAdjustment>(`${this.apiUrl}/${id}/items`, {
      body: { itemIds },
    });
  }
}
