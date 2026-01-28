import { Injectable } from '@angular/core';
import { CreateDocumentPurchaseItemDto } from '../../shared/interfaces/dtos/document-purchase/create-document-purchase-item.interface';
import { CreateDocumentPurchaseDto } from '../../shared/interfaces/dtos/document-purchase/create-document-purchase.interface';
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

  addItems(id: string, items: CreateDocumentPurchaseItemDto[]) {
    return this.http.post<DocumentPurchase>(`${this.apiUrl}/${id}/items`, { items });
  }

  updateItem(id: string, productId: string, item: CreateDocumentPurchaseItemDto) {
    // Note: productId is used as itemId in the backend implementation as per our logic
    return this.http.patch<DocumentPurchase>(`${this.apiUrl}/${id}/items/${productId}`, item);
  }

  removeItems(id: string, productIds: string[]) {
    return this.http.delete<DocumentPurchase>(`${this.apiUrl}/${id}/items`, {
      body: { productIds },
    });
  }
}
