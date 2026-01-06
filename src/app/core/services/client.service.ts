import { Injectable } from '@angular/core';
import { Client } from '../../shared/interfaces/entities/client.interface';
import { BaseService } from './base.service';

@Injectable({ providedIn: 'root' })
export class ClientService extends BaseService<Client> {
  protected apiUrl = '/api/clients';
}
