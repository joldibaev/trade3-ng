import { Injectable } from '@angular/core';
import { CreateDocumentPurchaseDto } from '../../shared/interfaces/dtos/create-document-purchase.interface';
import { UpdateDocumentPurchaseDto } from '../../shared/interfaces/dtos/update-document-purchase.interface';
import { DocumentPurchase } from '../../shared/interfaces/entities/document-purchase.interface';
import { BaseDocumentService } from './base-document.service';

@Injectable({ providedIn: 'root' })
export class DocumentPurchasesService extends BaseDocumentService<
  DocumentPurchase,
  CreateDocumentPurchaseDto,
  UpdateDocumentPurchaseDto
> {
  protected apiUrl = '/api/document-purchases';
}
