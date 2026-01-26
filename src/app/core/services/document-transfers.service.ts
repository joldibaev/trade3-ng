import { Injectable } from '@angular/core';
import {
  CreateDocumentTransferDto,
  CreateDocumentTransferItemInput,
} from '../../shared/interfaces/dtos/document-transfer/create-document-transfer.interface';
import { DocumentTransfer } from '../../shared/interfaces/entities/document-transfer.interface';
import { BaseDocumentService } from './base-document.service';

@Injectable({ providedIn: 'root' })
export class DocumentTransfersService extends BaseDocumentService<
  DocumentTransfer,
  CreateDocumentTransferDto,
  CreateDocumentTransferDto
> {
  protected apiUrl = '/api/document-transfers';

  addItems(id: string, items: CreateDocumentTransferItemInput[]) {
    return this.http.post<DocumentTransfer>(`${this.apiUrl}/${id}/items`, { items });
  }

  updateItem(id: string, itemId: string, item: CreateDocumentTransferItemInput) {
    return this.http.patch<DocumentTransfer>(`${this.apiUrl}/${id}/items/${itemId}`, item);
  }

  removeItems(id: string, itemIds: string[]) {
    return this.http.delete<DocumentTransfer>(`${this.apiUrl}/${id}/items`, { body: { itemIds } });
  }
}
