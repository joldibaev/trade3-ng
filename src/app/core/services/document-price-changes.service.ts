import { Injectable } from '@angular/core';
import { CreateDocumentPriceChangeDto } from '../../shared/interfaces/dtos/document-price-change/create-document-price-change.interface';
import { UpdateDocumentPriceChangeDto } from '../../shared/interfaces/dtos/document-price-change/update-document-price-change.interface';
import { DocumentPriceChange } from '../../shared/interfaces/entities/document-price-change.interface';
import { BaseDocumentService } from './base-document.service';

@Injectable({ providedIn: 'root' })
export class DocumentPriceChangesService extends BaseDocumentService<
  DocumentPriceChange,
  CreateDocumentPriceChangeDto,
  UpdateDocumentPriceChangeDto
> {
  protected apiUrl = '/api/document-price-changes';
}
