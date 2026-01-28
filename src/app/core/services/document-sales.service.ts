import { Injectable } from '@angular/core';
import { CreateDocumentSaleItemDto } from '../../shared/interfaces/dtos/document-sale/create-document-sale-item.interface';
import { CreateDocumentSaleDto } from '../../shared/interfaces/dtos/document-sale/create-document-sale.interface';
import { DocumentSale } from '../../shared/interfaces/entities/document-sale.interface';
import { BaseDocumentService } from './base-document.service';

@Injectable({ providedIn: 'root' })
export class DocumentSalesService extends BaseDocumentService<
  DocumentSale,
  CreateDocumentSaleDto,
  CreateDocumentSaleDto
> {
  protected apiUrl = '/api/document-sales';

  addItems(id: string, items: CreateDocumentSaleItemDto[]) {
    return this.http.post<DocumentSale>(`${this.apiUrl}/${id}/items`, { items });
  }

  updateItem(id: string, itemId: string, item: CreateDocumentSaleItemDto) {
    return this.http.patch<DocumentSale>(`${this.apiUrl}/${id}/items/${itemId}`, item);
  }

  removeItems(id: string, itemIds: string[]) {
    return this.http.delete<DocumentSale>(`${this.apiUrl}/${id}/items`, { body: { itemIds } });
  }
}
