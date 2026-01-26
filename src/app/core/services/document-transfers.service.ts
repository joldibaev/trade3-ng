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

  addItem(id: string, item: CreateDocumentTransferItemInput) {
    return this.http.post<DocumentTransfer>(`${this.apiUrl}/${id}/items`, item);
  }

  updateItem(id: string, itemId: string, item: CreateDocumentTransferItemInput) {
    return this.http.patch<DocumentTransfer>(`${this.apiUrl}/${id}/items/${itemId}`, item);
  }

  removeItem(id: string, itemId: string) {
    return this.http.delete<void>(`${this.apiUrl}/${id}/items/${itemId}`);
  }
}
