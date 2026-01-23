export interface CreateCategoryDto {
  name: string;
  parentId?: string;
  isActive?: boolean;
}
