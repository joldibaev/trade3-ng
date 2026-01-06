import { Injectable } from '@angular/core';
import { BaseService } from './base.service';
import { User } from '../../shared/interfaces/entities/user.interface';

@Injectable({ providedIn: 'root' })
export class UserService extends BaseService<User> {
    protected apiUrl = '/api/users';
}
