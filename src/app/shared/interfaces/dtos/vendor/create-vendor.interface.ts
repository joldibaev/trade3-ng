export interface CreateVendorDto {
  name: string;
  phone?: string;
  email?: string;
  address?: string;
  isActive?: boolean;
  deletedAt?: string;
}
