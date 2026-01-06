import { Injectable } from '@angular/core';
import { BaseService } from './base.service';
import { Client } from '../../shared/interfaces/entities/client.interface';

@Injectable({ providedIn: 'root' })
export class ClientService extends BaseService<Client> {
    protected apiUrl = '/api/clients';
}
