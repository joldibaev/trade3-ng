import { Injectable } from '@angular/core';
import { User } from '../../shared/interfaces/entities/user.interface';
import { BaseService } from './base.service';

@Injectable({ providedIn: 'root' })
export class UserService extends BaseService<User> {
  protected apiUrl = '/api/users';
}
