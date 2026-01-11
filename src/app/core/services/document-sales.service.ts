import { Injectable } from '@angular/core';
import { CreateDocumentSaleDto } from '../../shared/interfaces/dtos/create-document-sale.interface';
import { DocumentSale } from '../../shared/interfaces/entities/document-sale.interface';
import { BaseService } from './base.service';

@Injectable({ providedIn: 'root' })
export class DocumentSalesService extends BaseService<DocumentSale> {
  protected apiUrl = '/api/document-sales';

  createDocument(entity: CreateDocumentSaleDto) {
    return this.http.post<DocumentSale>(this.apiUrl, entity);
  }

  updateDocument(id: string, entity: CreateDocumentSaleDto) {
    return this.http.patch<DocumentSale>(`${this.apiUrl}/${id}`, entity);
  }
}
