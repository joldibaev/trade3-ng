import { Injectable } from '@angular/core';
import {
  CreateDocumentSaleDto,
  CreateDocumentSaleItemInput,
} from '../../shared/interfaces/dtos/document-sale/create-document-sale.interface';
import { DocumentSale } from '../../shared/interfaces/entities/document-sale.interface';
import { BaseDocumentService } from './base-document.service';

@Injectable({ providedIn: 'root' })
export class DocumentSalesService extends BaseDocumentService<
  DocumentSale,
  CreateDocumentSaleDto,
  CreateDocumentSaleDto
> {
  protected apiUrl = '/api/document-sales';

  addItems(id: string, items: CreateDocumentSaleItemInput[]) {
    return this.http.post<DocumentSale>(`${this.apiUrl}/${id}/items`, { items });
  }

  updateItem(id: string, itemId: string, item: CreateDocumentSaleItemInput) {
    return this.http.patch<DocumentSale>(`${this.apiUrl}/${id}/items/${itemId}`, item);
  }

  removeItems(id: string, itemIds: string[]) {
    return this.http.delete<DocumentSale>(`${this.apiUrl}/${id}/items`, { body: { itemIds } });
  }
}
