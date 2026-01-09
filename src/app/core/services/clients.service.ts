import { Injectable } from '@angular/core';
import { Client } from '../../shared/interfaces/entities/client.interface';
import { BaseService } from './base.service';

@Injectable({ providedIn: 'root' })
export class ClientsService extends BaseService<Client> {
  protected apiUrl = '/api/clients';
}
