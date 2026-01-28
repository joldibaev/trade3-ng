// This file is auto-generated. Do not edit.

import { Role } from '../../constants';

export interface CreateUserDto {
  email: string;
  passwordHash: string;
  refreshTokenHash?: string;
  role?: Role;
  isActive?: boolean;
}
