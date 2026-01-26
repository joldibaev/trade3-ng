import { Injectable } from '@angular/core';
import {
  CreateDocumentPurchaseDto,
  CreateDocumentPurchaseItemInput,
} from '../../shared/interfaces/dtos/document-purchase/create-document-purchase.interface';
import { UpdateDocumentPurchaseDto } from '../../shared/interfaces/dtos/document-purchase/update-document-purchase.interface';
import { DocumentPurchase } from '../../shared/interfaces/entities/document-purchase.interface';
import { BaseDocumentService } from './base-document.service';

@Injectable({ providedIn: 'root' })
export class DocumentPurchasesService extends BaseDocumentService<
  DocumentPurchase,
  CreateDocumentPurchaseDto,
  UpdateDocumentPurchaseDto
> {
  protected apiUrl = '/api/document-purchases';

  addItem(id: string, item: CreateDocumentPurchaseItemInput) {
    return this.http.post<DocumentPurchase>(`${this.apiUrl}/${id}/items`, item);
  }

  updateItem(id: string, productId: string, item: CreateDocumentPurchaseItemInput) {
    // Note: productId is used as itemId in the backend implementation as per our logic
    return this.http.patch<DocumentPurchase>(`${this.apiUrl}/${id}/items/${productId}`, item);
  }

  removeItem(id: string, productId: string) {
    return this.http.delete<DocumentPurchase>(`${this.apiUrl}/${id}/items/${productId}`);
  }
}
