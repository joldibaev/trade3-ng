import { Injectable } from '@angular/core';
import { DocumentStatus } from '../../shared/interfaces/constants';
import { CreateDocumentPurchaseDto } from '../../shared/interfaces/dtos/create-document-purchase.interface';
import { UpdateDocumentPurchaseDto } from '../../shared/interfaces/dtos/update-document-purchase.interface';
import { DocumentPurchase } from '../../shared/interfaces/entities/document-purchase.interface';
import { BaseService } from './base.service';

@Injectable({ providedIn: 'root' })
export class DocumentPurchasesService extends BaseService<DocumentPurchase> {
  protected apiUrl = '/api/document-purchases';

  createDocument(entity: CreateDocumentPurchaseDto) {
    return this.http.post<DocumentPurchase>(this.apiUrl, entity);
  }

  updateDocument(id: string, entity: UpdateDocumentPurchaseDto) {
    return this.http.patch<DocumentPurchase>(`${this.apiUrl}/${id}`, entity);
  }

  updateStatus(id: string, status: DocumentStatus) {
    return this.http.patch<DocumentPurchase>(`${this.apiUrl}/${id}/status`, { status });
  }
}
